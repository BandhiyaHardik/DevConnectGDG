import React, { useState, useEffect } from "react";
import { useFirebase } from "../contexts/FirebaseContext";
import SwipeCard from "../components/swipe/SwipeCard";
import RecommendModal from "../components/swipe/RecommendModal";
import FilterPanel from "../components/swipe/FilterPanel";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { firestore } from "../firebase/config";
import "./Swipe.css";
import { FiFilter } from "react-icons/fi";

const MOCK_PROFILES = [
  {
    uid: "dummy-1",
    displayName: "Alex Kim",
    photoURL: "https://ui-avatars.com/api/?name=Alex+Kim&background=4299e1&color=fff",
    location: "San Francisco",
    technologies: ["React", "Node.js", "TypeScript"],
    experience: "3-5 years",
    bio: "Full-stack developer passionate about building scalable web apps. Loves hiking and coffee.",
    lookingFor: ["Work", "Tech Friends", "Hackathons"],
    github: "alexkimdev",
    tag: "dummy",
  },
  {
    uid: "dummy-2",
    displayName: "Priya Sharma",
    photoURL: "https://ui-avatars.com/api/?name=Priya+Sharma&background=3182ce&color=fff",
    location: "Bangalore",
    technologies: ["Python", "Django", "PostgreSQL"],
    experience: "1-3 years",
    bio: "Backend engineer with a love for data and APIs. Open to remote work and collaborations.",
    lookingFor: ["Freelance", "Skill Development"],
    github: "priyasharma",
    tag: "dummy",
  },
  {
    uid: "dummy-3",
    displayName: "Lucas Müller",
    photoURL: "https://ui-avatars.com/api/?name=Lucas+Muller&background=63b3ed&color=fff",
    location: "Berlin",
    technologies: ["Java", "Spring", "AWS"],
    experience: "5+ years",
    bio: "Cloud architect and Java enthusiast. Enjoys mentoring and hackathons.",
    lookingFor: ["Hackathons", "Work"],
    github: "lucasmuller",
    tag: "dummy",
  },
  {
    uid: "dummy-4",
    displayName: "Sofia Rossi",
    photoURL: "https://ui-avatars.com/api/?name=Sofia+Rossi&background=4299e1&color=fff",
    location: "Milan",
    technologies: ["Vue.js", "Firebase", "CSS"],
    experience: "1-3 years",
    bio: "Frontend developer with a keen eye for design. Loves working on UI/UX challenges.",
    lookingFor: ["Tech Friends", "Skill Development"],
    github: "sofiarossi",
    tag: "dummy",
  },
  {
    uid: "dummy-5",
    displayName: "Ethan Lee",
    photoURL: "https://ui-avatars.com/api/?name=Ethan+Lee&background=3182ce&color=fff",
    location: "Seoul",
    technologies: ["Go", "Kubernetes", "Docker"],
    experience: "3-5 years",
    bio: "DevOps engineer automating everything. Always up for a tech chat.",
    lookingFor: ["Freelance", "Work"],
    github: "ethanlee",
    tag: "dummy",
  },
  {
    uid: "dummy-6",
    displayName: "Maria Garcia",
    photoURL: "https://ui-avatars.com/api/?name=Maria+Garcia&background=63b3ed&color=fff",
    location: "Madrid",
    technologies: ["Angular", "RxJS", "Sass"],
    experience: "5+ years",
    bio: "Senior frontend engineer and open source contributor. Loves teaching and learning.",
    lookingFor: ["Skill Development", "Tech Friends"],
    github: "mariagarcia",
    tag: "dummy",
  },
  {
    uid: "dummy-7",
    displayName: "David Smith",
    photoURL: "https://ui-avatars.com/api/?name=David+Smith&background=4299e1&color=fff",
    location: "London",
    technologies: ["C#", ".NET", "Azure"],
    experience: "3-5 years",
    bio: "Backend developer with a focus on scalable enterprise solutions.",
    lookingFor: ["Work", "Freelance"],
    github: "davidsmith",
    tag: "dummy",
  },
  {
    uid: "dummy-8",
    displayName: "Yuki Tanaka",
    photoURL: "https://ui-avatars.com/api/?name=Yuki+Tanaka&background=3182ce&color=fff",
    location: "Tokyo",
    technologies: ["Flutter", "Dart", "Firebase"],
    experience: "1-3 years",
    bio: "Mobile app developer. Loves building beautiful and fast apps.",
    lookingFor: ["Hackathons", "Skill Development"],
    github: "yukitanaka",
    tag: "dummy",
  },
  {
    uid: "dummy-9",
    displayName: "Chloe Dubois",
    photoURL: "https://ui-avatars.com/api/?name=Chloe+Dubois&background=63b3ed&color=fff",
    location: "Paris",
    technologies: ["PHP", "Laravel", "MySQL"],
    experience: "5+ years",
    bio: "Full-stack web developer and foodie. Always learning new frameworks.",
    lookingFor: ["Freelance", "Tech Friends"],
    github: "chloedubois",
    tag: "dummy",
  },
  {
    uid: "dummy-10",
    displayName: "Ivan Petrov",
    photoURL: "https://ui-avatars.com/api/?name=Ivan+Petrov&background=4299e1&color=fff",
    location: "Moscow",
    technologies: ["Rust", "WebAssembly", "GraphQL"],
    experience: "3-5 years",
    bio: "Systems programmer and open source lover. Enjoys solving complex problems.",
    lookingFor: ["Work", "Collaborations"],
    github: "ivanpetrov",
    tag: "dummy",
  },
];

const Swipe = () => {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMatch, setShowMatch] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("discover");
  const [pendingLikes, setPendingLikes] = useState([]);
  const [recommendProfile, setRecommendProfile] = useState(null);
  const [expandInfo, setExpandInfo] = useState(false);
  const [swipeAction, setSwipeAction] = useState(null);

  const [filters, setFilters] = useState({
    technologies: [],
    experience: [],
    lookingFor: [],
  });

  const { user, profile } = useFirebase();

  // Load profiles based on filters
  useEffect(() => {
    if (!user) return;

    const fetchProfiles = async () => {
      try {
        setLoading(true);

        // Get IDs of users current user has already liked or skipped
        const [likesSnapshot, skipsSnapshot] = await Promise.all([
          getDocs(query(collection(firestore, "likes"), where("fromUser", "==", user.uid))),
          getDocs(query(collection(firestore, "skips"), where("fromUser", "==", user.uid))),
        ]);

        const alreadyInteractedIds = new Set();
        likesSnapshot.forEach((doc) => alreadyInteractedIds.add(doc.data().toUser));
        skipsSnapshot.forEach((doc) => alreadyInteractedIds.add(doc.data().toUser));
        alreadyInteractedIds.add(user.uid); // Exclude self

        // --- FILTER LOGIC ---
        let usersQuery = query(
          collection(firestore, "users"),
          where("onboardingComplete", "==", true),
          limit(50)
        );

        // If skills are selected, filter in Firestore
        if (filters.technologies && filters.technologies.length > 0) {
          usersQuery = query(
            collection(firestore, "users"),
            where("onboardingComplete", "==", true),
            where("technologies", "array-contains-any", filters.technologies),
            limit(50)
          );
        }

        const usersSnapshot = await getDocs(usersQuery);

        // Helper for skill matching (case-insensitive, all skills must match)
        const matchesSkills = (profile) => {
          if (!filters.technologies || filters.technologies.length === 0) return true;
          if (!profile.technologies || profile.technologies.length === 0) return false;
          const profileTechs = profile.technologies.map(t => t.toLowerCase());
          return filters.technologies.every(
            tech => profileTechs.includes(tech.toLowerCase())
          );
        };

        // Function to match filters
        function matchesFilters(profile, filters) {
          // Technologies filter: all selected must be present
          if (filters.technologies && filters.technologies.length > 0) {
            if (!profile.technologies || profile.technologies.length === 0) return false;
            const profileTechs = profile.technologies.map(t => t.toLowerCase());
            const allTechsMatch = filters.technologies.every(
              tech => profileTechs.includes(tech.toLowerCase())
            );
            if (!allTechsMatch) return false;
          }

          // Experience filter: at least one must match
          if (filters.experience && filters.experience.length > 0) {
            if (!profile.experience) return false;
            if (!filters.experience.includes(profile.experience.toLowerCase())) return false;
          }

          // LookingFor filter: at least one must match
          if (filters.lookingFor && filters.lookingFor.length > 0) {
            if (!profile.lookingFor || profile.lookingFor.length === 0) return false;
            const lookingForLower = profile.lookingFor.map(l => l.toLowerCase());
            const hasLookingFor = filters.lookingFor.some(
              opt => lookingForLower.includes(opt.toLowerCase())
            );
            if (!hasLookingFor) return false;
          }

          return true;
        }

        // Helper function for dummy profile filtering
        function matchesDummy(profile, filters) {
          // Technologies filter: all selected must be present
          if (filters.technologies && filters.technologies.length > 0) {
            if (!profile.technologies || profile.technologies.length === 0) return false;
            const profileTechs = profile.technologies.map(t => t.toLowerCase());
            const allTechsMatch = filters.technologies.every(
              tech => profileTechs.includes(tech.toLowerCase())
            );
            if (!allTechsMatch) return false;
          }
          // Experience filter: at least one must match
          if (filters.experience && filters.experience.length > 0) {
            if (!profile.experience) return false;
            if (!filters.experience.includes(profile.experience.toLowerCase())) return false;
          }
          // LookingFor filter: at least one must match
          if (filters.lookingFor && filters.lookingFor.length > 0) {
            if (!profile.lookingFor || profile.lookingFor.length === 0) return false;
            const lookingForLower = profile.lookingFor.map(l => l.toLowerCase());
            const hasLookingFor = filters.lookingFor.some(
              opt => lookingForLower.includes(opt.toLowerCase())
            );
            if (!hasLookingFor) return false;
          }
          return true;
        }

        let fetchedProfiles = [];
        usersSnapshot.forEach((doc) => {
          const profileData = doc.data();
          if (alreadyInteractedIds.has(profileData.uid)) return;
          if (matchesFilters(profileData, filters)) {
            fetchedProfiles.push(profileData);
          }
        });

        // If no real profiles match, filter dummy profiles
        if (fetchedProfiles.length === 0) {
          fetchedProfiles = MOCK_PROFILES.filter(profile => {
            // Technologies filter: all selected must be present
            if (filters.technologies && filters.technologies.length > 0) {
              if (!profile.technologies || profile.technologies.length === 0) return false;
              const profileTechs = profile.technologies.map(t => t.toLowerCase());
              const allTechsMatch = filters.technologies.every(
                tech => profileTechs.includes(tech.toLowerCase())
              );
              if (!allTechsMatch) return false;
            }
            // Experience filter: at least one must match
            if (filters.experience && filters.experience.length > 0) {
              if (!profile.experience) return false;
              if (!filters.experience.includes(profile.experience.toLowerCase())) return false;
            }
            // LookingFor filter: at least one must match
            if (filters.lookingFor && filters.lookingFor.length > 0) {
              if (!profile.lookingFor || profile.lookingFor.length === 0) return false;
              const lookingForLower = profile.lookingFor.map(l => l.toLowerCase());
              const hasLookingFor = filters.lookingFor.some(
                opt => lookingForLower.includes(opt.toLowerCase())
              );
              if (!hasLookingFor) return false;
            }
            return true;
          });
        }

        setProfiles(fetchedProfiles.length > 0 ? fetchedProfiles : MOCK_PROFILES);
        setCurrentIndex(0);
        setError(null);
      } catch (err) {
        console.error("Error fetching profiles:", err);
        setError("Failed to load profiles. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [user, filters]);

  // Load pending likes (people who liked current user)
  useEffect(() => {
    if (!user) return;

    const fetchPendingLikes = async () => {
      try {
        const q = query(collection(firestore, "likes"), where("toUser", "==", user.uid));

        const likesSnapshot = await getDocs(q);
        const pendingLikes = [];

        // For each like, get the user who liked
        const likePromises = likesSnapshot.docs.map(async (likeDoc) => {
          const likeData = likeDoc.data();

          // Check if this is a match already (user has liked them back)
          const reverseCheck = await getDoc(doc(firestore, "likes", `${user.uid}_${likeData.fromUser}`));
          if (reverseCheck.exists()) {
            // This is a match, not a pending like
            return;
          }

          // Get the user profile
          const userDoc = await getDoc(doc(firestore, "users", likeData.fromUser));
          if (userDoc.exists()) {
            pendingLikes.push({
              ...userDoc.data(),
              likeTimestamp: likeData.timestamp,
            });
          }
        });

        await Promise.all(likePromises);

        // Sort by most recent first
        pendingLikes.sort((a, b) => {
          return b.likeTimestamp?.toDate() - a.likeTimestamp?.toDate();
        });

        setPendingLikes(pendingLikes);
      } catch (err) {
        console.error("Error fetching pending likes:", err);
      }
    };

    fetchPendingLikes();
  }, [user]);

  const handleSwipe = async (direction, profile) => {
    try {
      if (!user || !profile) {
        console.error("Missing user or profile data");
        return;
      }

      if (direction === "right") {
        // Connect with profile
        await handleLike(profile);
      } else {
        // Skip the profile
        await handleSkipProfile(profile);
      }

      // Move to next profile
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } catch (err) {
      console.error("Error handling swipe:", err);
    }
  };

  const handleLike = async (profile) => {
    try {
      // Create unique ID for the like document
      const likeId = `${user.uid}_${profile.uid}`;

      // Create the like document
      await setDoc(doc(firestore, "likes", likeId), {
        fromUser: user.uid,
        toUser: profile.uid,
        timestamp: serverTimestamp(),
      });

      // Check if this creates a match
      const reverseId = `${profile.uid}_${user.uid}`;
      const likeRef = doc(firestore, "likes", reverseId);
      const likeDoc = await getDoc(likeRef);

      // If the other user already liked current user, it's a match!
      if (likeDoc.exists()) {
        // Create a match document
        const matchData = {
          users: [user.uid, profile.uid],
          timestamp: serverTimestamp(),
          lastActivity: serverTimestamp(),
        };

        const matchRef = await addDoc(collection(firestore, "matches"), matchData);

        // Create a conversation for the match
        const conversationData = {
          participants: [user.uid, profile.uid],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          matchId: matchRef.id,
        };

        const conversationRef = await addDoc(collection(firestore, "conversations"), conversationData);

        // Create a welcome message
        await addDoc(collection(firestore, "messages"), {
          conversationId: conversationRef.id,
          text: "You're now connected! Say hello 👋",
          sentBy: "system",
          timestamp: serverTimestamp(),
          read: false,
        });

        // Show match screen
        setMatchData({
          profile,
          conversationId: conversationRef.id,
        });
        setShowMatch(true);
      }
    } catch (err) {
      console.error("Error liking profile:", err);
      throw err;
    }
  };

  // This is only for marking a profile as skipped in Firestore
  const handleSkipProfile = async (profile) => {
    try {
      const skipId = `${user.uid}_${profile.uid}`;
      await setDoc(doc(firestore, "skips", skipId), {
        fromUser: user.uid,
        toUser: profile.uid,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error skipping profile:", err);
    }
  };

  // Button handlers for swipe actions
  const handleSkip = () => setSwipeAction("left");
  const handleInfo = () => setSwipeAction("up");
  const handleConnect = () => setSwipeAction("right");

  // Handle match with a user who liked current user
  const handleMatchWithPendingLike = async (likedProfile) => {
    try {
      await handleLike(likedProfile);

      // Remove from pending likes
      setPendingLikes((prev) => prev.filter((p) => p.uid !== likedProfile.uid));
    } catch (err) {
      console.error("Error accepting like:", err);
    }
  };

  // Go to chat after match
  const handleGoToChat = () => {
    setShowMatch(false);
    if (matchData?.conversationId) {
      window.location.href = `/chat/${matchData.conversationId}`;
    }
  };

  // Continue swiping after match
  const handleContinueSwiping = () => {
    setShowMatch(false);
  };

  // Toggle filters panel
  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };

  // Apply filters
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setFiltersOpen(false);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({ technologies: [] });
  };

  // Show recommend modal
  const handleRecommend = (profile) => {
    setRecommendProfile(profile);
  };

  // Refresh profiles
  const handleRefresh = () => {
    setCurrentIndex(0);
    setProfiles([]);
    setLoading(true);

    // This will trigger the useEffect to reload profiles
    const refreshDate = new Date();
    setFilters((prev) => ({ ...prev, _refresh: refreshDate.getTime() }));
  };

  // Count active filters
  const activeFiltersCount = Object.values(filters).reduce(
    (count, filterArray) => {
      if (Array.isArray(filterArray)) {
        return count + filterArray.length;
      }
      return count;
    },
    0
  );

  // Get visible cards - show current and next 2 cards for stack effect
  const getVisibleCards = () => {
    return profiles
      .slice(currentIndex, currentIndex + 3)
      .map((profile, index) => (
        <SwipeCard
          key={profile.uid}
          profile={profile}
          isActive={index === 0}
          stackPosition={index}
          onSwipe={handleSwipe}
          onExpand={handleInfo}
          swipeAction={index === 0 ? swipeAction : null}
          onSwipeActionEnd={() => setSwipeAction(null)}
        />
      ));
  };

  // Check if we have more profiles
  const hasMoreProfiles = currentIndex < profiles.length;

  return (
    <div className="swipe-page">
      {/* Tab navigation */}
      <div className="swipe-header">
        <div className="swipe-tabs">
          <button
            className={`tab-button ${activeTab === "discover" ? "active" : ""}`}
            onClick={() => setActiveTab("discover")}
          >
            Discover
          </button>
          <button
            className={`tab-button ${activeTab === "likes" ? "active" : ""}`}
            onClick={() => setActiveTab("likes")}
          >
            Likes
            {pendingLikes.length > 0 && (
              <span className="likes-badge">{pendingLikes.length}</span>
            )}
          </button>
        </div>

        {activeTab === "discover" && (
          <button
            className={`filter-toggle${filtersOpen ? " active" : ""}`}
            onClick={toggleFilters}
            aria-label="Open filters"
            style={{ position: "relative" }}
          >
            <FiFilter size={24} />
            {activeFiltersCount > 0 && (
              <span className="filter-badge">{activeFiltersCount}</span>
            )}
          </button>
        )}
      </div>

      {/* Filters panel */}
      {filtersOpen && (
        <div className="filter-overlay" onClick={() => setFiltersOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <FilterPanel
              filters={filters}
              onClose={() => setFiltersOpen(false)}
              onApply={handleApplyFilters}
            />
          </div>
        </div>
      )}

      {/* Discover tab */}
      {activeTab === "discover" && (
        <div className="discover-tab">
          {loading ? (
            <div className="loading-profiles">
              <div className="spinner"></div>
              <p>Finding developers for you...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <p>{error}</p>
              <button onClick={handleRefresh} className="reload-btn">
                Try Again
              </button>
            </div>
          ) : !hasMoreProfiles ? (
            <div className="no-more-profiles">
              <div className="empty-state-icon">🔍</div>
              <h3>No more profiles</h3>
              <p>Check back later for new developers!</p>
              <button onClick={handleRefresh} className="reload-btn">
                Refresh
              </button>
            </div>
          ) : (
            <div className="cards-container">{getVisibleCards()}</div>
          )}

          {hasMoreProfiles && (
            <div className="swipe-actions">
              <button className="swipe-btn skip" onClick={handleSkip}>❌</button>
              <button className="swipe-btn info" onClick={handleInfo}>ℹ️</button>
              <button className="swipe-btn connect" onClick={handleConnect}>🤝</button>
            </div>
          )}

          {/* Recommend button below cards */}
          {hasMoreProfiles && (
            <button
              className="recommend-btn"
              onClick={() => handleRecommend(profiles[currentIndex])}
              style={{ margin: "18px auto 0 auto", display: "block", fontSize: "0.98rem", padding: "7px 18px", borderRadius: "14px", width: "fit-content" }}
            >
              <i className="fas fa-user-friends" style={{ marginRight: 7 }}></i>
              Recommend
            </button>
          )}
        </div>
      )}

      {/* Likes tab */}
      {activeTab === "likes" && (
        <div className="likes-tab">
          <h2>People who liked you</h2>

          {pendingLikes.length === 0 ? (
            <div className="no-likes">
              <div className="empty-state-icon">❤️</div>
              <h3>No likes yet</h3>
              <p>When someone likes your profile, they will appear here.</p>
            </div>
          ) : (
            <div className="pending-likes-grid">
              {pendingLikes.map((profile) => (
                <div
                  key={profile.uid}
                  className="pending-like-card"
                  onClick={() => handleMatchWithPendingLike(profile)}
                >
                  <div className="pending-like-photo">
                    {profile.photoURL ? (
                      <img src={profile.photoURL} alt={profile.displayName} />
                    ) : (
                      <div className="default-avatar">
                        {profile.displayName?.charAt(0) || "?"}
                      </div>
                    )}
                  </div>
                  <div className="pending-like-info">
                    <h3>{profile.displayName}</h3>
                    {profile.location && <p>{profile.location}</p>}

                    {profile.technologies?.length > 0 && (
                      <div className="pending-like-techs">
                        {profile.technologies.slice(0, 3).map((tech, i) => (
                          <span key={i} className="mini-tech-tag">
                            {tech}
                          </span>
                        ))}
                        {profile.technologies.length > 3 && (
                          <span className="more-tech">
                            +{profile.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="match-action-button">Connect Now</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Match popup */}
      {showMatch && matchData && (
        <div className="match-overlay">
          <div className="match-popup">
            <div className="match-header">
              <h2>It's a Match! 🎉</h2>
              <p>You and {matchData.profile.displayName} connected</p>
            </div>

            <div className="match-profiles">
              <div className="match-profile-photo you">
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt="You" />
                ) : (
                  <div className="default-avatar">
                    {profile?.displayName?.charAt(0) || "?"}
                  </div>
                )}
              </div>

              <div className="match-heart">❤️</div>

              <div className="match-profile-photo them">
                {matchData.profile.photoURL ? (
                  <img
                    src={matchData.profile.photoURL}
                    alt={matchData.profile.displayName}
                  />
                ) : (
                  <div className="default-avatar">
                    {matchData.profile.displayName?.charAt(0) || "?"}
                  </div>
                )}
              </div>
            </div>

            <div className="match-actions">
              <button
                className="match-action-chat"
                onClick={handleGoToChat}
              >
                Send a Message
              </button>
              <button
                className="match-action-continue"
                onClick={handleContinueSwiping}
              >
                Continue Swiping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recommend modal */}
      {recommendProfile && (
        <RecommendModal
          profile={recommendProfile}
          onClose={() => setRecommendProfile(null)}
        />
      )}
    </div>
  );
};

export default Swipe;