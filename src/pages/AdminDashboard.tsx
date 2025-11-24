import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, MapPin, Phone, Mail, FileText, Link as LinkIcon, Calendar, X, Check, XCircle, Send, Download, Eye } from "lucide-react";

// Firebase imports
import { db, auth } from '../firebase';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import emailjs from "@emailjs/browser";
import SEO from "../components/SEO.tsx";
import AdminPricingManagement from '../components/AdminPricingManagement';

export default function AdminDashboard() {
    const [applications, setApplications] = useState<any[]>([]);
    const [selectedApplication, setSelectedApplication] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showResumeModal, setShowResumeModal] = useState(false);
    const [activeTab, setActiveTab] = useState('applications'); // Add this state for tab navigation
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
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Admin Dashboard - SMS Technologies"
        description="Admin dashboard for managing applications and pricing"
        keywords="admin, dashboard, applications, pricing, management"
        canonicalUrl="https://smstechnologieset.com/admin"
      />
      
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, Admin</span>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'applications'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pricing'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pricing Management
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'applications' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Applications List */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Applications</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {loading ? (
                    <div className="px-6 py-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    </div>
                  ) : (
                    applications.map((application) => (
                      <div
                        key={application.id}
                        onClick={() => handleApplicationClick(application)}
                        className={`p-6 cursor-pointer hover:bg-gray-50 ${
                            selectedApplication?.id === application.id ? 'bg-purple-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{application.name}</h3>
                            <p className="text-sm text-gray-500">{application.role?.replace('-', ' ')}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                              {application.status || 'pending'}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">{formatDateTime(application.submittedAt)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Application Detail */}
            {selectedApplication && (
              <div className="lg:col-span-2">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">Application Details</h2>
                    <button
                      onClick={closeDetailPanel}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="px-6 py-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-500">Full Name</p>
                              <p className="text-sm text-gray-900">{selectedApplication.name}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-500">Address</p>
                              <p className="text-sm text-gray-900">{selectedApplication.address}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-500">Phone</p>
                              <p className="text-sm text-gray-900">{selectedApplication.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-500">Email</p>
                              <p className="text-sm text-gray-900">{selectedApplication.email}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Application Information</h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Position</p>
                            <p className="text-sm text-gray-900">{selectedApplication.role?.replace('-', ' ')}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Social Links</p>
                            <p className="text-sm text-gray-900">
                              {selectedApplication.socialLinks || 'None provided'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Resume</p>
                            <p className="text-sm text-gray-900">{selectedApplication.resume || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Submitted</p>
                            <p className="text-sm text-gray-900">{formatDateTime(selectedApplication.submittedAt)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Cover Letter</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex flex-wrap gap-3">
                      <button
                        onClick={() => updateApplicationStatus('accepted')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Accept
                      </button>
                      <button
                        onClick={() => updateApplicationStatus('rejected')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </button>
                      <button
                        onClick={openEmailModal}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Email
                      </button>
                      {selectedApplication.resumeData && (
                        <button
                          onClick={viewResume}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Resume
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Pricing Management Tab */
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Pricing Management</h2>
            </div>
            <div className="p-6">
              <AdminPricingManagement />
            </div>
          </div>
        )}
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

      {/* Resume Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl max-w-4xl w-full border border-white/20">
            <div className="sticky top-0 bg-white/10 backdrop-blur-lg p-6 border-b border-white/20 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Resume: {selectedApplication?.name}</h2>
              <button
                onClick={closeResumeModal}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
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
        </div>
      )}
    </div>
  );
}
