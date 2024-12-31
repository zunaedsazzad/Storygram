"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import division from "@/app/sign-up/division.json";
import district from "@/app/sign-up/districts.json";
import { useRouter } from "next/navigation";
import SpinnerSmSquareHorizontal from "@/components/SpinnerBaseSquareHorizontal"; 

const SignUpPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistric, setSelectedDistric] = useState("");
  const [age, setAge] = useState("");
  const [role, setRole] = useState("Normal user");
  const [genres, setGenres] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false); 
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Start spinner
    try {
      const response = await fetch("/api/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          address,
          division: selectedDivision,
          district: selectedDistric,
          age,
          role,
          genres,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/sign-in");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred during sign-up.");
    } finally {
      setIsLoading(false); // Stop spinner
    }
  };

  const handleGenreChange = (genre: string) => {
    setGenres((prevGenres) =>
      prevGenres.includes(genre)
        ? prevGenres.filter((g) => g !== genre)
        : [...prevGenres, genre]
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Fields */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
		  <div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						/>
					</div>
					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						/>
					</div>
					<div>
						<label htmlFor="address" className="block text-sm font-medium text-gray-700">
							Address
						</label>
						<input
							id="address"
							name="address"
							type="text"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						/>
					</div>
					<div>
						<label htmlFor="division" className="block text-sm font-medium text-gray-700">
							Division
						</label>
						<select
							id="division"
							name="division"
							value={selectedDivision}
							onChange={(e) => setSelectedDivision(e.target.value)}
							className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						>
							<option value="">Select Division</option>
							{division.data.map((div: { id: string; name: string }) => (
								<option key={div.id} value={div.name}>
									{div.name}
								</option>
							))}
						</select>
					</div>
					<div>
						<label htmlFor="district" className="block text-sm font-medium text-gray-700">
							District
						</label>
						<select
							id="district"
							name="district"
							value={selectedDistric}
							onChange={(e) => setSelectedDistric(e.target.value)}
							className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						>
							<option value="">Select District</option>
							{district.data.map((dist: { id: string; name: string }) => (
								<option key={dist.id} value={dist.name}>
									{dist.name}
								</option>
							))}
						</select>
					</div>
					<div>
						<label htmlFor="age" className="block text-sm font-medium text-gray-700">
							Age
						</label>
						<input
							id="age"
							name="age"
							type="number"
							value={age}
							onChange={(e) => setAge(e.target.value)}
							className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">Role</label>
						<div className="flex items-center">
							<input
								id="normal-user"
								name="role"
								type="radio"
								value="Normal user"
								checked={role === "Normal user"}
								onChange={(e) => setRole(e.target.value)}
								className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
							/>
							<label htmlFor="normal-user" className="ml-2 text-sm text-gray-700">
								General user
							</label>
						</div>
						<div className="flex items-center">
							<input
								id="organization"
								name="role"
								type="radio"
								value="Organization"
								checked={role === "Organization"}
								onChange={(e) => setRole(e.target.value)}
								className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
							/>
							<label htmlFor="organization" className="ml-2 text-sm text-gray-700">
								Organization
							</label>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">Favourite Book Genres</label>
						<div className="flex flex-wrap gap-2">
							{["Fiction", "Non-Fiction", "Mystery", "Fantasy", "Science Fiction", "Biography"].map((genre) => (
								<div key={genre} className="flex items-center">
									<input
										id={genre}
										name="genres"
										type="checkbox"
										value={genre}
										checked={genres.includes(genre)}
										onChange={() => handleGenreChange(genre)}
										className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
									/>
									<label htmlFor={genre} className="ml-2 text-sm text-gray-700">
										{genre}
									</label>
								</div>
							))}
						</div>
					</div>
          <div>
            <button
              type="submit"
              className={`w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isLoading ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <SpinnerSmSquareHorizontal />
                </div>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
