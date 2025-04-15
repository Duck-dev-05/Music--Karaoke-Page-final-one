import { executeQuery } from '.';
import { UserProfile, userProfileSchema } from './schema';
import { unstable_noStore as noStore } from 'next/cache';

export async function getUserProfile(userId: string) {
  noStore();
  try {
    const result = await executeQuery(
      `
      SELECT 
        u.*,
        us.total_songs,
        us.total_playlists,
        us.total_favorites,
        us.last_active
      FROM users u
      LEFT JOIN user_stats us ON u.id = us.user_id
      WHERE u.id = $1
      `,
      [userId]
    );

    if (!result.rows[0]) {
      throw new Error('User not found');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>) {
  try {
    // Validate data
    const validatedData = userProfileSchema.partial().parse(data);

    // Create SET clause dynamically
    const updates = Object.entries(validatedData)
      .filter(([_, value]) => value !== undefined)
      .map(([key, _], index) => `${snakeCase(key)} = $${index + 2}`);

    if (updates.length === 0) {
      return await getUserProfile(userId);
    }

    const values = Object.values(validatedData).filter(value => value !== undefined);
    
    const result = await executeQuery(
      `
      UPDATE users
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
      `,
      [userId, ...values]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
}

export async function getUserStats(userId: string) {
  noStore();
  try {
    const result = await executeQuery(
      'SELECT * FROM user_stats WHERE user_id = $1',
      [userId]
    );

    return result.rows[0] || {
      total_songs: 0,
      total_playlists: 0,
      total_favorites: 0,
      last_active: new Date()
    };
  } catch (error) {
    console.error('Error in getUserStats:', error);
    throw error;
  }
}

export async function updateUserStats(userId: string, stats: {
  totalSongs?: number;
  totalPlaylists?: number;
  totalFavorites?: number;
}) {
  try {
    const result = await executeQuery(
      `
      INSERT INTO user_stats (
        user_id, 
        total_songs, 
        total_playlists, 
        total_favorites, 
        last_active
      )
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id)
      DO UPDATE SET
        total_songs = COALESCE($2, user_stats.total_songs),
        total_playlists = COALESCE($3, user_stats.total_playlists),
        total_favorites = COALESCE($4, user_stats.total_favorites),
        last_active = CURRENT_TIMESTAMP
      RETURNING *
      `,
      [
        userId,
        stats.totalSongs,
        stats.totalPlaylists,
        stats.totalFavorites
      ]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error in updateUserStats:', error);
    throw error;
  }
}

export async function logUserActivity(userId: string, activityType: string, activityData: any) {
  try {
    await executeQuery(
      `
      INSERT INTO user_activity (user_id, activity_type, activity_data)
      VALUES ($1, $2, $3)
      `,
      [userId, activityType, JSON.stringify(activityData)]
    );
  } catch (error) {
    console.error('Error in logUserActivity:', error);
    // Don't throw error for activity logging to prevent disrupting the main flow
    console.error(error);
  }
}

export async function getUserActivity(userId: string, limit = 10) {
  noStore();
  try {
    const result = await executeQuery(
      `
      SELECT * FROM user_activity
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
      `,
      [userId, limit]
    );

    return result.rows;
  } catch (error) {
    console.error('Error in getUserActivity:', error);
    throw error;
  }
}

// Utility function to convert camelCase to snake_case
function snakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
} 