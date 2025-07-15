import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFirebase } from '../contexts/FirebaseContext';
import { firestore } from '../firebase/config';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import ProfileCard from '../components/profile/ProfileCard';
import './Dashboard.css';
import DebugUserInfo from '../components/common/DebugUserInfo';

// We'll fetch real data, but keep mock data as fallback
const getMockEvents = () => [
	{
		id: 1,
		title: 'React Conf Hackathon',
		date: '2025-07-15',
		participants: 120,
		image: 'https://images.unsplash.com/photo-1540304453527-62f979142a17',
	},
	{
		id: 2,
		title: 'AI Developer Meetup',
		date: '2025-07-21',
		participants: 45,
		image: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c',
	},
	{
		id: 3,
		title: 'Mobile App Challenge',
		date: '2025-08-02',
		participants: 75,
		image: 'https://images.unsplash.com/photo-1551434678-e076c223a692',
	},
];

const Dashboard = () => {
	const { user, profile, loading: authLoading } = useFirebase();
	const [matches, setMatches] = useState([]);
	const [events, setEvents] = useState([]);
	const [stats, setStats] = useState({
		connections: 0,
		profileViews: 0,
		skillMatches: 0,
		projectsStarted: 0,
	});
	const [loading, setLoading] = useState(true);
	const [projectIdeas, setProjectIdeas] = useState([]);
	const [profiles, setProfiles] = useState([]);
	const [profileCompletionPercentage, setProfileCompletionPercentage] = useState(65);

	useEffect(() => {
		if (authLoading) return;

		const fetchProfiles = async () => {
			try {
				const profilesCollection = collection(firestore, 'users');
				// Don't include current user in results and limit to 20
				const profilesQuery = query(
					profilesCollection,
					where('uid', '!=', user.uid),
					limit(20)
				);
				const profilesSnapshot = await getDocs(profilesQuery);
				const profilesList = profilesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
				setProfiles(profilesList);
			} catch (error) {
				console.error('Error fetching profiles:', error);
			}
		};

		const fetchMatches = async () => {
			try {
				// Get user's matches from Firebase
				const matchesRef = collection(firestore, 'matches');
				const matchesQuery = query(matchesRef, where('users', 'array-contains', user.uid));
				const matchesSnapshot = await getDocs(matchesQuery);

				// If we have matches, fetch the matched users' profiles
				if (!matchesSnapshot.empty) {
					const matchedProfiles = [];

					for (const matchDoc of matchesSnapshot.docs) {
						const matchData = matchDoc.data();
						const otherUserId = matchData.users.find((id) => id !== user.uid);

						// Get the other user's profile
						const userRef = collection(firestore, 'users');
						const userQuery = query(userRef, where('uid', '==', otherUserId));
						const userSnapshot = await getDocs(userQuery);

						if (!userSnapshot.empty) {
							const userData = userSnapshot.docs[0].data();
							matchedProfiles.push({
								id: otherUserId,
								name: userData.displayName,
								title: userData.title || 'Developer',
								avatar: userData.photoURL,
								matchDate: matchData.createdAt?.toDate?.() || new Date(),
								skills: userData.technologies || [],
								newMessages: matchData.unreadCount || 0,
								conversationId: matchData.conversationId || matchDoc.id, // <-- Add this line!
							});
						}
					}

					setMatches(matchedProfiles);
				} else {
					// Fallback to mock data for new users with no matches yet
					const mockMatches = [
						{
							id: 'user1',
							name: 'Sophia Lee',
							title: 'Full Stack Developer',
							avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
							matchDate: '2025-07-10',
							skills: ['React', 'Node.js', 'MongoDB'],
							newMessages: 2,
							conversationId: 'mock-convo-user1', // <-- Add this!
						},
						{
							id: 'user2',
							name: 'Alex Chen',
							title: 'Frontend Developer',
							avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
							matchDate: '2025-07-09',
							skills: ['React', 'TypeScript', 'CSS'],
							newMessages: 0,
							conversationId: 'mock-convo-user2', // <-- Add this!
						},
					];

					setMatches(mockMatches);
				}
			} catch (error) {
				console.error('Error fetching matches:', error);
				// Fallback to mock data
				const mockMatches = [
					{
						id: 'user1',
						name: 'Sophia Lee',
						title: 'Full Stack Developer',
						avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
						matchDate: '2025-07-10',
						skills: ['React', 'Node.js', 'MongoDB'],
						newMessages: 2,
						conversationId: 'mock-convo-user1', // <-- Add this!
					},
					{
						id: 'user2',
						name: 'Alex Chen',
						title: 'Frontend Developer',
						avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
						matchDate: '2025-07-09',
						skills: ['React', 'TypeScript', 'CSS'],
						newMessages: 0,
						conversationId: 'mock-convo-user2', // <-- Add this!
					},
				];

				setMatches(mockMatches);
			}
		};

		const fetchStats = async () => {
			try {
				// Get stats from Firebase (in a real app, you'd have a stats collection or calculate it)
				// For now, let's generate some random stats
				const mockStats = {
					connections: Math.floor(Math.random() * 10) + 1,
					profileViews: Math.floor(Math.random() * 50) + 10,
					skillMatches: Math.floor(Math.random() * 20) + 5,
					projectsStarted: Math.floor(Math.random() * 5),
				};

				setStats(mockStats);
			} catch (error) {
				console.error('Error fetching stats:', error);
				// Fallback stats
				setStats({
					connections: 8,
					profileViews: 42,
					skillMatches: 15,
					projectsStarted: 2,
				});
			}
		};

		const fetchProjectIdeas = async () => {
			try {
				// In a real app, these would come from Firebase
				const mockProjectIdeas = [
					{
						id: 1,
						title: 'AI-Powered Code Assistant',
						description: 'Build a VS Code extension that provides intelligent code suggestions.',
						skills: ['JavaScript', 'Python', 'Machine Learning'],
						difficulty: 'Intermediate',
						commitmentLevel: 'Medium',
					},
					{
						id: 2,
						title: 'Developer Portfolio Generator',
						description: 'Create a tool that automatically generates portfolios from GitHub profiles.',
						skills: ['React', 'GraphQL', 'GitHub API'],
						difficulty: 'Beginner',
						commitmentLevel: 'Low',
					},
					{
						id: 3,
						title: 'Collaborative Coding Platform',
						description: 'Build a real-time collaborative code editor with built-in video chat.',
						skills: ['WebRTC', 'JavaScript', 'WebSockets'],
						difficulty: 'Advanced',
						commitmentLevel: 'High',
					},
				];

				setProjectIdeas(mockProjectIdeas);
			} catch (error) {
				console.error('Error fetching project ideas:', error);
				// Fallback to mock data
			}
		};

		const fetchEvents = async () => {
			try {
				// In a real app, events would come from Firebase
				setEvents(getMockEvents());
			} catch (error) {
				console.error('Error fetching events:', error);
			}
		};

		const calculateProfileCompletion = () => {
			if (!profile) return 0;

			let fields = 0;
			let completedFields = 0;

			// Basic info
			fields += 3;
			if (profile.displayName) completedFields++;
			if (profile.photoURL) completedFields++;
			if (profile.bio) completedFields++;

			// Professional info
			fields += 3;
			if (profile.technologies && profile.technologies.length > 0) completedFields++;
			if (profile.githubUsername) completedFields++;
			if (profile.location) completedFields++;

			// Additional info
			fields += 2;
			if (profile.experience) completedFields++;
			if (profile.lookingFor && profile.lookingFor.length > 0) completedFields++;

			return Math.round((completedFields / fields) * 100);
		};

		const loadDashboardData = async () => {
			setLoading(true);

			try {
				await Promise.all([
					fetchProfiles(),
					fetchMatches(),
					fetchStats(),
					fetchProjectIdeas(),
					fetchEvents(),
				]);

				// Calculate profile completion percentage
				const completionPercentage = calculateProfileCompletion();
				setProfileCompletionPercentage(completionPercentage);
			} catch (error) {
				console.error('Error loading dashboard data:', error);
			} finally {
				setLoading(false);
			}
		};

		loadDashboardData();
	}, [user, profile, authLoading]);

	const formatDate = (dateString) => {
		const options = { month: 'short', day: 'numeric' };
		return new Date(dateString).toLocaleDateString('en-US', options);
	};

	if (authLoading || loading) {
		return (
			<div className="dashboard-loading">
				<div className="dashboard-loader"></div>
				<p>Loading your dashboard...</p>
			</div>
		);
	}

	return (
		<div className="dashboard-page-container">
			{/* Welcome Section */}
			<section className="welcome-section">
				<div className="welcome-content">
					<h1>Welcome back, {profile?.displayName || user?.displayName || 'Developer'}!</h1>
					<p>Here's what's happening in your developer network</p>
				</div>
				<Link to="/swipe" className="start-matching-btn">
					<i className="fas fa-code"></i> Start Matching
				</Link>
			</section>

			{/* Stats Overview */}
			<section className="stats-section">
				<div className="stat-card">
					<div className="stat-value">{stats.connections}</div>
					<div className="stat-label">Connections</div>
					<i className="fas fa- shake stat-icon"></i>
				</div>
				<div className="stat-card">
					<div className="stat-value">{stats.profileViews}</div>
					<div className="stat-label">Profile Views</div>
					<i className="fas fa-eye stat-icon"></i>
				</div>
				<div className="stat-card">
					<div className="stat-value">{stats.skillMatches}</div>
					<div className="stat-label">Skill Matches</div>
					<i className="fas fa-code stat-icon"></i>
				</div>
				<div className="stat-card">
					<div className="stat-value">{stats.projectsStarted}</div>
					<div className="stat-label">Projects</div>
					<i className="fas fa-rocket stat-icon"></i>
				</div>
			</section>

			{/* Recent Matches */}
			<section className="dashboard-section">
				<div className="section-header">
					<h2>Recent Matches</h2>
					<Link to="/matches" className="see-all-link">
						See All <i className="fas fa-chevron-right"></i>
					</Link>
				</div>

				<div className="matches-container">
					{matches.length > 0 ? (
						matches.map((match) => (
							<div className="match-card" key={match.id}>
								<div className="match-avatar">
									<img src={match.avatar} alt={match.name} />
									{match.newMessages > 0 && (
										<span className="message-badge">{match.newMessages}</span>
									)}
								</div>
								<div className="match-info">
									<h3>{match.name}</h3>
									<p>{match.title}</p>
									<div className="match-skills">
										{match.skills.slice(0, 2).map((skill) => (
											<span className="skill-tag" key={skill}>
												{skill}
											</span>
										))}
										{match.skills.length > 2 && (
											<span className="more-skills">+{match.skills.length - 2}</span>
										)}
									</div>
									<span className="match-date">Matched {formatDate(match.matchDate)}</span>
								</div>
								<Link
									to={`/chat/${match.conversationId}?otherUserId=${match.id}`}
									className="message-btn"
								>
									<i className="fas fa-comment-alt"></i>
									{match.newMessages > 0 ? 'Reply' : 'Message'}
								</Link>
							</div>
						))
					) : (
						<div className="empty-state">
							<i className="fas fa-users empty-icon"></i>
							<h3>No matches yet</h3>
							<p>Start swiping to find developers with matching skills and interests.</p>
							<Link to="/swipe" className="action-btn">
								Find Developers
							</Link>
						</div>
					)}
				</div>
			</section>

			{/* Upcoming Events/Hackathons */}
			<section className="dashboard-section">
				<div className="section-header">
					<h2>Upcoming Hackathons</h2>
					<Link to="/hackathons" className="see-all-link">
						See All <i className="fas fa-chevron-right"></i>
					</Link>
				</div>

				<div className="events-container">
					{events.map((event) => (
						<div
							className="event-card"
							key={event.id}
							style={{ backgroundImage: `url(${event.image})` }}
						>
							<div className="event-overlay">
								<div className="event-content">
									<h3>{event.title}</h3>
									<div className="event-details">
										<span>
											<i className="fas fa-calendar-day"></i> {formatDate(event.date)}
										</span>
										<span>
											<i className="fas fa-users"></i> {event.participants} participants
										</span>
									</div>
								</div>
								<button className="join-event-btn">Join Event</button>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Project Collaboration Ideas */}
			<section className="dashboard-section">
				<div className="section-header">
					<h2>Project Ideas</h2>
					<span className="subtitle">Find teammates for these popular project ideas</span>
				</div>

				<div className="projects-container">
					{projectIdeas.map((project) => (
						<div className="project-card" key={project.id}>
							<h3>{project.title}</h3>
							<p>{project.description}</p>
							<div className="project-meta">
								<div
									className="project-difficulty"
									data-level={project.difficulty.toLowerCase()}
								>
									<span className="difficulty-dot"></span>
									{project.difficulty}
								</div>
								<div className="project-commitment">
									<i className="fas fa-clock"></i> {project.commitmentLevel} commitment
								</div>
							</div>
							<div className="project-skills">
								{project.skills.map((skill) => (
									<span className="skill-tag" key={skill}>
										{skill}
									</span>
								))}
							</div>
							<div className="project-actions">
								<button className="find-team-btn">Find Teammates</button>
								<button className="save-project-btn">
									<i className="far fa-bookmark"></i>
								</button>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Get Started Guide */}
			<section className="onboarding-section">
				<div className="onboarding-card">
					<div className="onboarding-content">
						<h2>Complete Your Profile</h2>
						<p>Developers with complete profiles get 3x more matches!</p>
						<div className="progress-container">
							<div
								className="progress-bar"
								style={{ width: `${profileCompletionPercentage}%` }}
							></div>
							<span>{profileCompletionPercentage}% complete</span>
						</div>
						<ul className="onboarding-tasks">
							<li className={profile?.photoURL ? 'task-complete' : ''}>
								<i
									className={
										profile?.photoURL ? 'fas fa-check-circle' : 'far fa-circle'
									}
								></i>
								<span>Add profile picture</span>
							</li>
							<li className={profile?.technologies?.length > 0 ? 'task-complete' : ''}>
								<i
									className={
										profile?.technologies?.length > 0
											? 'fas fa-check-circle'
											: 'far fa-circle'
									}
								></i>
								<span>List your top skills</span>
							</li>
							<li className={profile?.githubUsername ? 'task-complete' : ''}>
								<i
									className={
										profile?.githubUsername ? 'fas fa-check-circle' : 'far fa-circle'
									}
								></i>
								<span>Connect GitHub account</span>
							</li>
							<li className={profile?.blog ? 'task-complete' : ''}>
								<i className={profile?.blog ? 'fas fa-check-circle' : 'far fa-circle'}></i>
								<span>Add your portfolio URL</span>
							</li>
						</ul>
						<Link to="/profile" className="complete-profile-btn">
							Complete Profile
						</Link>
					</div>
					<div className="onboarding-image">
						<img
							src="https://images.unsplash.com/photo-1522071820081-009f0129c71c"
							alt="Complete your profile"
						/>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Dashboard;