import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, MapPin, Phone, Mail, FileText, Link as LinkIcon, Calendar, X, Check, XCircle, Send, Download, Eye } from "lucide-react";

// Firebase imports
import { db, auth } from '../firebase';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import emailjs from "@emailjs/browser";
import SEO from "../components/SEO.tsx";

export default function AdminDashboard() {
    const [applications, setApplications] = useState<any[]>([]);
    const [selectedApplication, setSelectedApplication] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showResumeModal, setShowResumeModal] = useState(false);
    const [emailData, setEmailData] = useState({
        subject: "",
        message: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // Check if user is admin
                if (currentUser.email === "admin@smstechnologies.com") {
                    fetchApplications();
                } else {
                    // Not an admin, redirect to login
                    signOut(auth);
                    navigate("/login");
                }
            } else {
                // No user, redirect to login
                navigate("/login");
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const fetchApplications = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "careerApplications"));
            const apps: any[] = [];
            querySnapshot.forEach((doc) => {
                apps.push({ id: doc.id, ...doc.data() });
            });
            setApplications(apps);
        } catch (error: any) {
            console.error("Error fetching applications: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    const formatDateTime = (date: any) => {
        // Handle different date formats
        let dateObj;

        if (date instanceof Date) {
            dateObj = date;
        } else if (date?.toDate) {
            // Firestore timestamp
            dateObj = date.toDate();
        } else if (typeof date === 'string' || typeof date === 'number') {
            // String or timestamp
            dateObj = new Date(date);
        } else {
            // Fallback
            dateObj = new Date();
        }

        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(dateObj);
    };

  const handleApplicationClick = async (application: any) => {
    // Fetch full application details from Firebase
    try {
      const docRef = doc(db, "careerApplications", application.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSelectedApplication({ id: docSnap.id, ...docSnap.data() });
      } else {
        // Fallback to the application data we already have
        setSelectedApplication(application);
      }
    } catch (error: any) {
      console.error("Error fetching application details: ", error);
      // Fallback to the application data we already have
      setSelectedApplication(application);
    }
  };

  const closeDetailPanel = () => {
    setSelectedApplication(null);
  };

  const openEmailModal = () => {
    setEmailData({
      subject: `Regarding your application for ${selectedApplication?.role?.replace("-", " ")}`,
      message: ""
    });
    setShowEmailModal(true);
  };

  const closeEmailModal = () => {
    setShowEmailModal(false);
    setEmailData({
      subject: "",
      message: ""
    });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID!,
        import.meta.env.VITE_EMAILJS_AUTO_TEMPLATE_ID!,
        {
          to_email: selectedApplication?.email,
          to_name: selectedApplication?.name,
          subject: emailData.subject,
          message: emailData.message,
          reply_to: "smstechnologies.dev@gmail.com"
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY!
      );

      if (result.text === "OK") {
        closeEmailModal();
        // Show success message or update UI
      }
    } catch (error) {
      console.error("EmailJS Error:", error);
      // Handle error
    }
  };

  const updateApplicationStatus = async (status: string) => {
    if (!selectedApplication) return;
    
    try {
      const applicationRef = doc(db, "careerApplications", selectedApplication.id);
      await updateDoc(applicationRef, {
        status: status
      });
      
      // Update local state
      setSelectedApplication(prev => ({
        ...prev,
        status: status
      }));
      
      // Update applications list
      setApplications(prev => 
        prev.map(app => 
          app.id === selectedApplication.id 
            ? { ...app, status: status } 
            : app
        )
      );
    } catch (error) {
      console.error("Error updating application status: ", error);
    }
  };

  const viewResume = () => {
    // Show the resume modal
    setShowResumeModal(true);
  };

  const closeResumeModal = () => {
    setShowResumeModal(false);
  };

  // Function to download the resume
  const downloadResume = () => {
    if (!selectedApplication?.resumeData) return;
    
    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = selectedApplication.resumeData;
    link.download = selectedApplication.resume || 'resume';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to open resume in a new tab
  const openResumeInNewTab = () => {
    if (!selectedApplication?.resumeData) return;
    
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Resume: ${selectedApplication.name}</title>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              background: linear-gradient(135deg, #C1BBF4, #2C40F3);
              font-family: 'Inter', sans-serif;
              min-height: 100vh;
            }
            .container { 
              max-width: 800px; 
              margin: 0 auto; 
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(10px);
              padding: 20px; 
              border-radius: 16px;
              border: 1px solid rgba(255, 255, 255, 0.2);
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }
            h1 { 
              color: white; 
              text-align: center;
              margin-bottom: 20px;
              font-weight: 700;
            }
            .info { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 20px;
              padding: 15px;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 12px;
            }
            .info div { 
              flex: 1; 
            }
            .info strong { 
              display: block; 
              color: rgba(255, 255, 255, 0.8);
            }
            iframe { 
              width: 100%; 
              height: 600px; 
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 12px;
              background: white;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Resume: ${selectedApplication.name}</h1>
            <div class="info">
              <div>
                <strong>Email:</strong>
                <span style="color: white;">${selectedApplication.email}</span>
              </div>
              <div>
                <strong>Role:</strong>
                <span style="color: white;">${selectedApplication.role?.replace("-", " ")}</span>
              </div>
              <div>
                <strong>Submitted:</strong>
                <span style="color: white;">${formatDateTime(selectedApplication.submittedAt)}</span>
              </div>
            </div>
            <iframe src="${selectedApplication.resumeData}" title="Resume"></iframe>
          </div>
        </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#C1BBF4]/90 to-[#2C40F3]/90 flex items-center justify-center">
        <SEO 
          title="Admin Dashboard - Loading..."
          description="Loading career applications dashboard for SMS Technologies administrators."
          ogTitle="Admin Dashboard - Loading..."
          ogDescription="Loading career applications dashboard for SMS Technologies administrators."
          twitterTitle="Admin Dashboard - Loading..."
          twitterDescription="Loading career applications dashboard for SMS Technologies administrators."
          canonicalUrl="https://smstechnologieset.com/admin/dashboard"
        />
        <div className="text-white text-xl">Loading applications...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#C1BBF4]/90 to-[#2C40F3]/90 flex items-center justify-center">
        <SEO 
          title="Admin Dashboard - Redirecting..."
          description="Redirecting to login page for SMS Technologies admin dashboard."
          ogTitle="Admin Dashboard - Redirecting..."
          ogDescription="Redirecting to login page for SMS Technologies admin dashboard."
          twitterTitle="Admin Dashboard - Redirecting..."
          twitterDescription="Redirecting to login page for SMS Technologies admin dashboard."
          canonicalUrl="https://smstechnologieset.com/admin/dashboard"
        />
        <div className="text-white text-xl">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C1BBF4]/90 to-[#2C40F3]/90">
      <SEO 
        title="Admin Dashboard - SMS Technologies"
        description="Admin dashboard for managing career applications at SMS Technologies. Review, accept, or reject job applications."
        keywords="admin dashboard, career applications, job applications, SMS Technologies, application management"
        ogTitle="Admin Dashboard - SMS Technologies"
        ogDescription="Admin dashboard for managing career applications at SMS Technologies. Review, accept, or reject job applications."
        twitterTitle="Admin Dashboard - SMS Technologies"
        twitterDescription="Admin dashboard for managing career applications at SMS Technologies. Review, accept, or reject job applications."
        canonicalUrl="https://smstechnologieset.com/admin/dashboard"
      />
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 rounded-full p-2">
              <img src="/assets/sms-logo.png" alt="SMS Technologies" className="h-8 w-auto" />
            </div>
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Career Applications</h2>
          <p className="text-white/80">Manage and review job applications ({applications.length} total)</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Applications Table */}
          <div className="lg:w-1/2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/20">
                  <thead className="bg-white/5">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Name</th>
                      {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Role</th> */}
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {applications.map((application) => (
                      <tr 
                        key={application.id} 
                        onClick={() => handleApplicationClick(application)}
                        className={`cursor-pointer hover:bg-white/5 transition-colors ${
                          selectedApplication?.id === application.id ? 'bg-white/10' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{application.name}</td>
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">{application.email}</td> */}
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80 capitalize">
                          {application.role?.replace("-", " ")}
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                          {formatDateTime(application.submittedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            application.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : application.status === 'accepted' 
                              ? 'bg-green-100 text-green-800'
                              : application.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {application.status?.charAt(0).toUpperCase() + application.status?.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {applications.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-white/60 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No applications yet</h3>
                  <p className="text-white/80">When candidates apply for positions, their applications will appear here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Application Detail Panel */}
          <div className="lg:w-1/2">
            {selectedApplication ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 h-full">
                <div className="p-6 border-b border-white/20">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 rounded-full p-2">
                        <User className="text-white" size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{selectedApplication.name}</h3>
                        <p className="text-white/80 capitalize">
                          Applying for: {selectedApplication.role?.replace("-", " ")}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={closeDetailPanel}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  
                  {selectedApplication.status && (
                    <div className="mt-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedApplication.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : selectedApplication.status === 'accepted' 
                          ? 'bg-green-100 text-green-800'
                          : selectedApplication.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-250px)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Mail className="text-white/60 mt-1" size={20} />
                        <div>
                          <p className="text-sm text-white/80">Email</p>
                          <p className="text-white">{selectedApplication.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Phone className="text-white/60 mt-1" size={20} />
                        <div>
                          <p className="text-sm text-white/80">Phone</p>
                          <p className="text-white">{selectedApplication.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <MapPin className="text-white/60 mt-1" size={20} />
                        <div>
                          <p className="text-sm text-white/80">Address</p>
                          <p className="text-white">{selectedApplication.address}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Calendar className="text-white/60 mt-1" size={20} />
                        <div>
                          <p className="text-sm text-white/80">Submitted</p>
                          <p className="text-white">
                            {formatDateTime(selectedApplication.submittedAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <FileText className="text-white/60 mt-1" size={20} />
                        <div>
                          <p className="text-sm text-white/80">Resume/CV</p>
                          <p className="text-white">{selectedApplication.resume}</p>
                          {selectedApplication.resume && selectedApplication.resume !== "No file uploaded" && (
                            <button 
                              onClick={viewResume}
                              className="mt-2 flex items-center text-sm bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded transition-colors"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Resume
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {selectedApplication.socialLinks && (
                        <div className="flex items-start space-x-3">
                          <LinkIcon className="text-white/60 mt-1" size={20} />
                          <div>
                            <p className="text-sm text-white/80">Social Links</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {typeof selectedApplication.socialLinks === 'string' 
                                ? selectedApplication.socialLinks.split(', ').map((link: string, index: number) => (
                                    link.trim() && (
                                      <a
                                        key={index}
                                        href={link.trim()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full transition-colors"
                                      >
                                        {new URL(link.trim()).hostname.replace("www.", "")}
                                      </a>
                                    )
                                  ))
                                : Array.isArray(selectedApplication.socialLinks) 
                                ? selectedApplication.socialLinks.map((link: string, index: number) => (
                                    link.trim() && (
                                      <a
                                        key={index}
                                        href={link.trim()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full transition-colors"
                                      >
                                        {new URL(link.trim()).hostname.replace("www.", "")}
                                      </a>
                                    )
                                  ))
                                : null
                              }
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                        {/* Resume Dropdown Panel */}
      {showResumeModal && (
        <div className="mt-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden transition-all duration-300 ease-in-out w-full">
          <div className="sticky top-0 bg-white/10 backdrop-blur-lg p-4 border-b border-white/20 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Resume: {selectedApplication?.name}</h2>
            <div className="flex gap-2">
              <button 
                onClick={downloadResume}
                className="flex items-center px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </button>
              <button 
                onClick={openResumeInNewTab}
                className="flex items-center px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
              >
                <Eye className="w-4 h-4 mr-1" />
                Open in New Tab
              </button>
              <button
                onClick={closeResumeModal}
                className="text-white/80 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="p-4">
            {selectedApplication?.resumeData ? (
              <div className="border border-white/20 rounded-xl overflow-hidden bg-white">
                <iframe 
                  src={selectedApplication.resumeData} 
                  title="Resume Preview"
                  className="w-full h-[calc(100vh-300px)]"
                  onError={(e) => {
                    // Handle case where iframe can't display the file
                    const target = e.target as HTMLIFrameElement;
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'p-8 text-center';
                    fallback.innerHTML = `
                      <div class="p-8 text-center">
                        <FileText class="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Preview Not Available</h3>
                        <p class="text-gray-500 mb-4">The resume file format cannot be previewed directly.</p>
                        <button id="downloadBtn" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                          Download Resume
                        </button>
                      </div>
                    `;
                    target.parentNode?.appendChild(fallback);
                    const downloadBtn = fallback.querySelector('#downloadBtn');
                    if (downloadBtn) {
                      downloadBtn.addEventListener('click', downloadResume);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="bg-white/10 rounded-lg p-8 border border-white/20 text-center">
                <FileText className="mx-auto h-16 w-16 text-white/60 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No Resume Available</h3>
                <p className="text-white/80">
                  This application was submitted without a resume file.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
         <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Cover Letter</h4>
                    <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <p className="text-white whitespace-pre-line">{selectedApplication.coverLetter}</p>
                    </div>
                  </div>
                  
                  {/* Status Update Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-white/20">
                    {selectedApplication.status !== 'accepted' && (
                      <button
                        onClick={() => updateApplicationStatus('accepted')}
                        className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Accept
                      </button>
                    )}
                    
                    {selectedApplication.status !== 'rejected' && (
                      <button
                        onClick={() => updateApplicationStatus('rejected')}
                        className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </button>
                    )}
                    
                    <button
                      onClick={openEmailModal}
                      className="flex items-center px-4 py-2 bg-white text-[#5300FF] hover:bg-[#5300FF] hover:text-white rounded-lg font-medium transition-colors"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Contact Candidate
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <FileText className="mx-auto h-12 w-12 text-white/60 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Select an application</h3>
                  <p className="text-white/80">Choose an application from the list to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl max-w-2xl w-full border border-white/20">
            <div className="sticky top-0 bg-white/10 backdrop-blur-lg p-6 border-b border-white/20 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Contact {selectedApplication?.name}</h2>
              <button
                onClick={closeEmailModal}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={sendEmail} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={emailData.subject}
                  onChange={handleEmailChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Message</label>
                <textarea
                  name="message"
                  value={emailData.message}
                  onChange={handleEmailChange}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeEmailModal}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-white text-[#5300FF] hover:bg-[#5300FF] hover:text-white rounded-lg font-medium transition-colors"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}