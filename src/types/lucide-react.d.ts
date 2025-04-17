declare module 'lucide-react' {
  import { FC, SVGProps } from 'react'
  
  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string
    absoluteStrokeWidth?: boolean
    color?: string
  }
  
  export type Icon = FC<IconProps>
  
  export const Music: Icon
  export const Heart: Icon
  export const PlayCircle: Icon
  export const ListMusic: Icon
  export const Settings: Icon
  export const User: Icon
  export const LogOut: Icon
  export const Menu: Icon
  export const X: Icon
  export const Search: Icon
  export const Globe: Icon
  export const MapPin: Icon
  export const Link: Icon
  // Add other icons as needed
} 