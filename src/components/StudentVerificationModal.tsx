"use client";

import { useState } from "react";
import Image from "next/image";

interface StudentVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export default function StudentVerificationModal({
  isOpen,
  onClose,
  onVerified,
}: StudentVerificationModalProps) {
  const [studentEmail, setStudentEmail] = useState("");
  const [studentId, setStudentId] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }
      setStudentId(file);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!studentEmail.endsWith(".edu")) {
      setError("Please use a valid .edu email address");
      return;
    }

    if (!studentId) {
      setError("Please upload your student ID");
      return;
    }

    setIsSubmitting(true);
    try {
      // Here you would typically upload the student ID and verify the email
      // For now, we'll simulate the verification process
      await new Promise(resolve => setTimeout(resolve, 1500));
      onVerified();
      onClose();
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6">Student Verification</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student Email (.edu)
            </label>
            <input
              type="email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your.email@university.edu"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student ID Card
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="student-id-upload"
              />
              <label
                htmlFor="student-id-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                {studentId ? (
                  <div className="relative w-full h-40">
                    <Image
                      src={URL.createObjectURL(studentId)}
                      alt="Student ID Preview"
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-1 text-sm text-gray-500">
                      Click to upload your student ID
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md 
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isSubmitting ? "Verifying..." : "Verify & Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 