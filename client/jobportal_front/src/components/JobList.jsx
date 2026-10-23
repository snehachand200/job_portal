
// import { useEffect, useState } from "react";

// function JobList() {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const response = await fetch("/jobs/");

//         if (!response.ok) {
//           throw new Error("Unable to load jobs.");
//         }

//         const data = await response.json();

//         // Supports normal lists and paginated DRF responses
//         setJobs(Array.isArray(data) ? data : data.results || []);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, []);

//   return (
//     <div className="jobs-container">
//       <h2>Available Jobs</h2>
//       <p>Find a job that matches your skills.</p>

//       {loading && <p>Loading jobs...</p>}

//       {error && <p className="error-message">{error}</p>}

//       {!loading && !error && jobs.length === 0 && (
//         <p>No jobs available yet. Please check back later.</p>
//       )}

//       <div className="job-grid">
//         {jobs.map((job) => (
//           <div className="job-card" key={job.id}>
//             <h3>{job.title}</h3>

//             <p>
//               <strong>Company:</strong>{" "}
//               {job.company_name}
//             </p>

//             <p>
//               <strong>Location:</strong>{" "}
//               {job.location}
//             </p>

//             <p>
//               <strong>Salary:</strong>{" "}
//               {job.salary || "Not specified"}
//             </p>

//             <p>
//               <strong>Job Type:</strong>{" "}
//               {job.job_type}
//             </p>

//             <p>{job.description}</p>

//             <button
//               onClick={() =>
//                 alert("Apply functionality will be added next!")
//               }
//             >
//               Apply Now
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default JobList;




import { useEffect, useState } from "react";

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/jobs/");

        if (!response.ok) {
          throw new Error("Failed to load jobs. Please try again.");
        }

        const data = await response.json();

        // Supports both normal lists and paginated API responses
        const jobData = Array.isArray(data)
          ? data
          : data.results || [];

        setJobs(jobData);
      } catch (err) {
        setError(
          "Unable to load jobs. Please check whether Django is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in before applying for a job.");
      return;
    }

    try {
      const response = await fetch("/apply/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          job: jobId,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        alert("Your job application was submitted successfully!");
      } else {
        alert(
          data.detail ||
          data.error ||
          data.message ||
          JSON.stringify(data) ||
          "Unable to apply for this job."
        );
      }
    } catch (err) {
      alert("Unable to connect to the server. Please check Django.");
    }
  };

  return (
    <div className="jobs-container">
      <div className="jobs-heading">
        <h2>Available Jobs</h2>
        <p>Find a job that matches your skills and interests.</p>
      </div>

      {loading && (
        <p className="loading-message">Loading available jobs...</p>
      )}

      {error && (
        <p className="error-message">{error}</p>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="empty-jobs">
          <h3>No jobs available yet</h3>
          <p>Please check back later for new opportunities.</p>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <>
          <p className="job-count">
            {jobs.length} job{jobs.length !== 1 ? "s" : ""} available
          </p>

          <div className="job-grid">
            {jobs.map((job) => (
              <div className="job-card" key={job.id}>
                <div className="job-card-header">
                  <h3>{job.title}</h3>
                  <span className="job-type">
                    {job.job_type || "Not specified"}
                  </span>
                </div>

                <p className="company-name">
                  <strong>Company:</strong>{" "}
                  {job.company_name || "Not specified"}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {job.location || "Not specified"}
                </p>

                <p>
                  <strong>Salary:</strong>{" "}
                  {job.salary || "Not specified"}
                </p>

                <div className="job-description">
                  <strong>Description:</strong>
                  <p>
                    {job.description || "No description provided."}
                  </p>
                </div>

                <button
                  className="apply-button"
                  onClick={() => handleApply(job.id)}
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default JobList;
