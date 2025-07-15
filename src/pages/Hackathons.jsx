import React, { useEffect, useState } from "react";
import { fetchHackathonsFromGemini } from "../firebase/gemini";
import "./Hackathons.css";

const mockHackathons = [
	{
		id: 1,
		title: "Global Hackathon 2025",
		date: "2025-08-10",
		location: "San Francisco, CA",
		description: "A worldwide hackathon for all tech enthusiasts.",
		image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
	},
	{
		id: 2,
		title: "AI Innovators Challenge",
		date: "2025-09-05",
		location: "Berlin, Germany",
		description: "Build the next big thing in AI.",
		image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
	},
	// ...more mock data  
];

const formatDate = (dateStr) => {
	const d = new Date(dateStr);
	return d.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
};

const Hackathons = () => {
	const [geminiHackathons, setGeminiHackathons] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchHackathonsFromGemini().then((data) => {
			setGeminiHackathons(data);
			setLoading(false);
		});
	}, []);

	return (
		<div className="hackathons-page">
			<h1>Ongoing & Upcoming Hackathons</h1>
			<div className="hackathons-list">
				{/* Mock Data */}
				{mockHackathons.map((h) => (
					<div className="hackathon-card" key={h.id}>
						<img src={h.image} alt={h.title} className="hackathon-img" />
						<div className="hackathon-info">
							<h2>{h.title}</h2>
							<p>
								<strong>Date:</strong> {formatDate(h.date)}
							</p>
							<p>
								<strong>Location:</strong> {h.location}
							</p>
							<p>{h.description}</p>
						</div>
					</div>
				))}
			</div>

			{/* Gemini Data */}
			<h2 style={{ marginTop: "2rem" }}>Live Hackathons (Powered by Gemini)</h2>
			{loading && <div>Loading hackathons...</div>}
			<div className="hackathons-list">
				{geminiHackathons.map((h, idx) => (
					<div className="hackathon-card" key={h.title + idx}>
						{/* You can use a placeholder image or generate one based on title */}
						<img
							src={`https://source.unsplash.com/400x200/?hackathon,${encodeURIComponent(
								h.title
							)}`}
							alt={h.title}
							className="hackathon-img"
						/>
						<div className="hackathon-info">
							<h2>{h.title}</h2>
							<p>
								<strong>Date:</strong> {formatDate(h.date)}
							</p>
							<p>
								<strong>Location:</strong> {h.location}
							</p>
							<p>{h.description}</p>
						</div>
					</div>
				))}
				{!loading && geminiHackathons.length === 0 && (
					<div>No live hackathons found.</div>
				)}
			</div>
		</div>
	);
};

export default Hackathons;