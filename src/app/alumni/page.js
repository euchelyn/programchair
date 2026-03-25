'use client';



import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import './alumni-globals.css';



export default function AlumniDashboard() {

    const router = useRouter();

    const [isDarkMode, setIsDarkMode] = useState(true);

    


    const [activeTab, setActiveTab] = useState('dashboard');

    

    const [activeModal, setActiveModal] = useState(null);

    const [isInviteOpen, setIsInviteOpen] = useState(false);

    

    const [dbUser, setDbUser] = useState(null);



    const [employerStatus, setEmployerStatus] = useState('Pending');

    const [employmentStatus, setEmploymentStatus] = useState(''); 

    const [jobTitle, setJobTitle] = useState('');

    const [companyName, setCompanyName] = useState('');

    const [savedJobStatus, setSavedJobStatus] = useState('Not Updated');

    const [showInviteBtn, setShowInviteBtn] = useState(true);



    const [userData, setUserData] = useState({

        name: 'Loading...',

        batch: '----',

        program: 'Loading...',

        initials: '...'

    });



    useEffect(() => {

        const savedTheme = localStorage.getItem('theme');

        if (savedTheme === 'light') {

            setIsDarkMode(false);

            document.documentElement.removeAttribute('data-theme');

        } else {

            document.documentElement.setAttribute('data-theme', 'dark');

        }



        const session = JSON.parse(localStorage.getItem('current_user') || '{}');

        const db = JSON.parse(localStorage.getItem('obe_masterlist') || '[]');

        

        if (session && session.id) {

            const fullUser = db.find(student => student.id === session.id);

            

            if (fullUser) {

                setDbUser(fullUser);

                setEmployerStatus(fullUser.employerStatus || 'Pending');

                setSavedJobStatus(fullUser.employmentStatus || 'Not Updated');



                const nameParts = fullUser.name.split(' ').filter(n => n);

                let generatedInitials = 'AL';

                if (nameParts.length >= 2) {

                    generatedInitials = nameParts[0][0].toUpperCase() + nameParts[nameParts.length - 1][0].toUpperCase();

                } else if (nameParts.length === 1) {

                    generatedInitials = nameParts[0].substring(0, 2).toUpperCase();

                }



                setUserData({

                    name: fullUser.name,

                    batch: fullUser.batch,

                    program: fullUser.program || 'B.S. Computer Engineering',

                    initials: generatedInitials

                });

            }

        } else {

            router.push('/');

        }

    }, [router]);



    const toggleTheme = () => {

        const newTheme = !isDarkMode;

        setIsDarkMode(newTheme);

        if (newTheme) {

            document.documentElement.setAttribute('data-theme', 'dark');

            localStorage.setItem('theme', 'dark');

        } else {

            document.documentElement.removeAttribute('data-theme');

            localStorage.setItem('theme', 'light');

        }

    };



    const handleLogout = () => {

        if (confirm("Are you sure you want to log out?")) {

            localStorage.removeItem('current_user');

            router.push('/');

        }

    };



    const handleSaveJobUpdate = () => {

        if (!dbUser) return;

        

        const db = JSON.parse(localStorage.getItem('obe_masterlist') || '[]');

        const updatedDb = db.map(student => {

            if (student.id === dbUser.id) {

                return {

                    ...student,

                    employmentStatus: employmentStatus,

                    jobTitle: employmentStatus === 'employed' ? jobTitle : '',

                    companyName: employmentStatus === 'employed' ? companyName : ''

                };

            }

            return student;

        });



        localStorage.setItem('obe_masterlist', JSON.stringify(updatedDb));

        

        setSavedJobStatus(employmentStatus);

        setDbUser({ ...dbUser, employmentStatus: employmentStatus, jobTitle, companyName });

        setActiveModal(null);

        setEmploymentStatus('');

        setJobTitle('');

        setCompanyName('');

        alert('Job Status Updated!');

    };



    const handleSendInvite = () => {

        if (!dbUser) return;



        const db = JSON.parse(localStorage.getItem('obe_masterlist') || '[]');

        const updatedDb = db.map(student => {

            if (student.id === dbUser.id) {

                return { ...student, employerStatus: 'sent' };

            }

            return student;

        });



        localStorage.setItem('obe_masterlist', JSON.stringify(updatedDb));

        setEmployerStatus('sent');

        setIsInviteOpen(false);

        alert('Official Invitation Sent!');

    };



    return (

        <div className="portal-layout">

            <aside className="sidebar">

                <div className="brand">

                    <img src="/cdm-logo.png" alt="CDM Logo" className="school-logo-side" />

                    <div className="brand-text">

                        <h3>CDM-OBE System</h3>

                        <span>Alumni</span>

                    </div>

                </div>



                <nav className="nav-menu">

                    <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>

                        My Dashboard

                    </button>

                    <button className={`nav-btn ${activeTab === 'determinants' ? 'active' : ''}`} onClick={() => setActiveTab('determinants')}>

                        Determinant Courses

                    </button>

                    <button className={`nav-btn ${activeTab === 'tracer' ? 'active' : ''}`} onClick={() => setActiveTab('tracer')}>

                        Graduate Tracer

                    </button>



                    <div style={{ margin: '20px 0', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}></div>

                    

                    <button className="nav-btn" onClick={() => setActiveModal('guide')}>System Guide / FAQs</button>

                    <button className="nav-btn" onClick={() => setActiveModal('correction')}>Data Correction</button>

                </nav>



                <div className="sidebar-bottom">

                    <button className="nav-btn theme-switch" onClick={toggleTheme}>

                        {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}

                    </button>

                    <button className="nav-btn logout" onClick={handleLogout}>Log Out</button>

                </div>

            </aside>



            <main className="main-content" style={{ overflowY: 'auto' }}>

                <header className="alumni-header">

                    <div className="profile-ring">

                        <div className="profile-pic" style={{ backgroundColor: '#ffd700', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: '500' }}>

                            {userData.initials}

                        </div>

                    </div>

                    <div className="header-text">

                        <h1>Hello, Engineer !</h1>

                        <p><strong>{userData.name}</strong> | {userData.program} | Batch {userData.batch}</p>

                    </div>

                </header>


                {activeTab === 'dashboard' && (

                    <div className="dashboard-grid" style={{ animation: 'fadeIn 0.3s ease' }}>

                        <div className="widget-column">

                            <div className="portal-card widget-card">

                                <div className="widget-icon-box">💼</div>

                                <div className="widget-content">

                                    <h3>Work Status</h3>

                                    <p>Update your alma mater on your professional journey.</p>

                                    <button className="widget-btn primary-btn" onClick={() => setActiveModal('jobUpdate')}>Update Employment Status</button>

                                </div>

                            </div>



                            <div className="portal-card widget-card">

                                <div className="widget-icon-box">📊</div>

                                <div className="widget-content">

                                    <h3>Curriculum Evaluation (Indirect)</h3>

                                    <p>Overall program effectiveness based on PEO and PO determinants.</p>

                                    

                                    <div className="progress-section" style={{ marginBottom: '20px' }}>

                                        <div className="progress-labels">

                                            <span>Overall Completion</span>

                                            <span>{dbUser?.surveyProgress || '0%'}</span>

                                        </div>

                                        <div className="progress-bar-bg">

                                            <div className="progress-fill" style={{ width: dbUser?.surveyProgress || '0%' }}></div>

                                        </div>

                                    </div>



                                    <div className="eval-breakdown">

                                        <div className="eval-group">

                                            <div className="metric-row">

                                                <span className="metric-label">1-Year Graduate Survey</span>

                                                <span className={`metric-status ${dbUser?.surveyProgress === '100%' ? 'status-verified' : 'status-pending'}`}>

                                                    {dbUser?.surveyProgress === '100%' ? 'Completed' : 'Pending'}

                                                </span>

                                            </div>

                                            <div className="metric-row">

                                                <span className="metric-label">3-5 Year Graduate Survey</span>

                                                <span className="metric-status status-pending">Not Applicable</span>

                                            </div>

                                        </div>

                                    </div>



                                    <button 

                                        className="widget-btn outline-btn" 

                                        style={{ marginTop: '25px' }}

                                        onClick={() => router.push('/alumni/survey')}

                                    >

                                        Start Evaluation Survey

                                    </button>

                                </div>

                            </div>

                        </div>



                        <div className="widget-column">

                            <div className="portal-card activity-container">

                                <h3>Activity</h3>

                                <ul className="activity-feed">

                                    <li><strong>Status:</strong> {savedJobStatus.toUpperCase()}</li>

                                    {savedJobStatus === 'employed' && (

                                        <li><strong>Company:</strong> {dbUser?.companyName}</li>

                                    )}

                                    <li><strong>Today:</strong> Logged in.</li>

                                </ul>

                            </div>



                            <div className="portal-card">

                                <div className="tracker-header">

                                    <h3>Employer Evaluation Tracker</h3>

                                    <span className="status-icon">

                                        {(savedJobStatus === 'unemployed' || savedJobStatus === 'Not Updated') ? '🚫' : employerStatus === 'Pending' ? '⏳' : employerStatus === 'sent' ? '✉️' : '✅'}

                                    </span>

                                </div>

                                

                                {(savedJobStatus === 'unemployed' || savedJobStatus === 'self-employed' || savedJobStatus === 'Not Updated') ? (

                                    <div className="tracker-status">

                                        <p><strong>Status:</strong> Not Applicable</p>

                                        <p className="sub-text" style={{ marginTop: '4px' }}>

                                            {savedJobStatus === 'self-employed' 

                                                ? "Employer evaluation is not required for self-employed alumni." 

                                                : savedJobStatus === 'Not Updated' 

                                                ? "Please update your employment status first." 

                                                : "Employer evaluation is not required for your current employment status."}

                                        </p>

                                    </div>

                                ) : (

                                    <>

                                        <div className="tracker-status" style={{ marginBottom: isInviteOpen ? '0' : '10px' }}>

                                            <p style={{fontSize: '0.9rem'}}><strong>Status:</strong> {

                                                employerStatus === 'Pending' ? 'Waiting to invite employer' : 

                                                employerStatus === 'sent' ? 'Invitation Sent!' : 

                                                'Evaluation Completed!'

                                            }</p>

                                        </div>



                                        {showInviteBtn && employerStatus === 'Pending' && (

                                            <button 

                                                className="outline-btn" 

                                                onClick={() => {

                                                    setIsInviteOpen(true);

                                                    setShowInviteBtn(false);

                                                }} 

                                                style={{ width: 'auto', padding: '8px 16px', fontSize: '0.85rem', borderRadius: '8px' }}

                                            >

                                                + Invite Employer

                                            </button>

                                        )}



                                        <div className={`invite-form-container ${isInviteOpen ? 'open' : ''}`}>

                                            <div style={{ marginTop: '15px', borderTop: '1px solid var(--border-color)', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

                                                <input type="text" placeholder="Name of HR / Supervisor" className="correction-textbox" style={{ height: '40px', padding: '0 15px' }} />

                                                <input type="text" placeholder="Name of Company" className="correction-textbox" style={{ height: '40px', padding: '0 15px' }} />

                                                <input type="email" placeholder="Company Email" className="correction-textbox" style={{ height: '40px', padding: '0 15px' }} />

                                                

                                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>

                                                    <button className="outline-btn cancel-btn" onClick={() => { setIsInviteOpen(false); setTimeout(() => setShowInviteBtn(true), 300); }} style={{ padding: '8px 16px', borderRadius: '6px', flex: 1, fontWeight: '600' }}>Cancel</button>

                                                    <button className="primary-btn" onClick={handleSendInvite} style={{ padding: '8px 16px', borderRadius: '6px', flex: 1, border: 'none', fontWeight: '600' }}>Send</button>

                                                </div>

                                            </div>

                                        </div>

                                    </>

                                )}

                            </div>

                        </div>

                    </div>

                )}


                {activeTab === 'determinants' && (

                    <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        <div className="portal-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                            <div>

                                <h2 style={{ color: 'var(--gold)', marginBottom: '5px' }}>Direct Assessment Portfolio</h2>

                                <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>Synced in real-time from the Program Chair's Evaluation Masterlist.</p>

                            </div>

                            <span style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)', color: '#34d399', padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid #34d399' }}>

                                ✅ Access Granted: 4th Year / Alumni

                            </span>

                        </div>




                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>


                            {(dbUser?.evaluatedCourses || [

                                { code: 'Determinant 1', name: 'Mathematics & Basic Engineering', po: 'PO a-d', grade: dbUser?.det1Grade, icon: '📐' },

                                { code: 'Determinant 2', name: 'Core Computer Engineering', po: 'PO e-h', grade: dbUser?.det2Grade, icon: '💻' },

                                { code: 'Determinant 3', name: 'OJT & Capstone Design', po: 'PO i-l', grade: dbUser?.det3Grade, icon: '⚙️' }

                            ]).map((course, idx) => (

                                <div key={idx} className="portal-card" style={{ backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>

                                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{course.icon || '📘'}</div>

                                    <h3 style={{ marginBottom: '5px' }}>{course.code}</h3>

                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', marginBottom: '20px' }}>{course.name} ({course.po})</p>

                                    

                                    <div style={{ padding: '15px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                                        <span style={{ fontWeight: '500' }}>Evaluated Grade:</span>

                                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: course.grade ? 'var(--gold)' : 'var(--text-sub)' }}>

                                            {course.grade || 'Pending'}

                                        </span>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                )}



                {activeTab === 'tracer' && (

                    <div style={{ animation: 'fadeIn 0.3s ease' }}>

                        <div className="portal-card" style={{ textAlign: 'center', padding: '60px 40px', maxWidth: '800px', margin: '0 auto' }}>

                            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎓</div>

                            <h2 style={{ fontSize: '2rem', color: 'var(--gold)', marginBottom: '15px' }}>Graduate Tracer Study</h2>

                            <p style={{ fontSize: '1rem', color: 'var(--text-sub)', lineHeight: '1.6', marginBottom: '40px' }}>

                                In compliance with the Commission on Higher Education (CHED), we kindly ask you to complete this modified Graduate Tracer Study. Your responses will help the college evaluate the relevance of our curriculum and improve our programs for future engineers.

                            </p>

                            <button 

                                className="primary-btn" 

                                style={{ padding: '15px 40px', fontSize: '1.1rem', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}

                                onClick={() => router.push('/alumni/tracer')}

                            >

                                Start Tracer Questionnaire

                            </button>

                        </div>

                    </div>

                )}



            </main>




            {activeModal === 'guide' && (

                <div className="modal-overlay">

                    <div className="modal-box portal-card">

                        <h2 style={{ marginBottom: '15px', color: 'var(--gold)' }}>System Guide & FAQs</h2>

                        <div style={{ marginBottom: '20px', lineHeight: '1.6', fontSize: '0.95rem' }}>

                            <p style={{ marginBottom: '10px' }}><strong>draft</strong></p>

                            <p style={{ marginBottom: '15px', opacity: 0.8 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

                            <p style={{ marginBottom: '10px' }}><strong>draft</strong></p>

                            <p style={{ opacity: 0.8 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>

                        </div>

                        <button className="outline-btn" onClick={() => setActiveModal(null)} style={{ marginTop: '0', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer' }}>Close</button>

                    </div>

                </div>

            )}



            {activeModal === 'correction' && (

                <div className="modal-overlay">

                    <div className="modal-box portal-card">

                        <h2 style={{ marginBottom: '10px', color: 'var(--gold)' }}>Data Correction Request</h2>

                        <p style={{ marginBottom: '20px', fontSize: '0.9rem', opacity: 0.8 }}>Is there an error in your name, batch year, or contact info? Send a correction request to your Program Chair. </p>

                        <textarea className="correction-textbox" placeholder="Halimbawa: Ang batch year ko po dapat ay 2026, hindi 2025..."></textarea>

                        <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>

                            <button className="cancel-btn" onClick={() => setActiveModal(null)} style={{ padding: '10px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', flex: 1 }}>Cancel</button>

                            <button className="primary-btn" onClick={() => { alert('Request Sent!'); setActiveModal(null); }} style={{ padding: '10px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', flex: 1, border: 'none' }}>Submit Request</button>

                        </div>

                    </div>

                </div>

            )}



            {activeModal === 'jobUpdate' && (

                <div className="modal-overlay">

                    <div className="modal-box portal-card">

                        <h2 style={{ marginBottom: '10px', color: 'var(--gold)' }}>Update Employment Status</h2>

                        <p style={{ marginBottom: '20px', fontSize: '0.9rem', opacity: 0.8 }}>Paki-update muna ang iyong current employment details bago mag-proceed sa survey.</p>



                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                            <select 

                                className="correction-textbox" 

                                style={{ height: '45px', padding: '0 15px', color: 'var(--text-main)', backgroundColor: 'transparent' }}

                                value={employmentStatus}

                                onChange={(e) => setEmploymentStatus(e.target.value)}

                            >

                                <option value="" style={{ color: '#000' }}>Select Employment Status...</option>

                                <option value="employed" style={{ color: '#000' }}>Employed</option>

                                <option value="self-employed" style={{ color: '#000' }}>Self-Employed / Business Owner</option>

                                <option value="unemployed" style={{ color: '#000' }}>Unemployed</option>

                            </select>



                            {employmentStatus === 'employed' && (

                                <>

                                    <input 

                                        type="text" 

                                        placeholder="Current Job Title (e.g., Software Engineer)" 

                                        className="correction-textbox" 

                                        style={{ height: '45px', padding: '0 15px' }} 

                                        value={jobTitle}

                                        onChange={(e) => setJobTitle(e.target.value)}

                                    />

                                    <input 

                                        type="text" 

                                        placeholder="Company Name" 

                                        className="correction-textbox" 

                                        style={{ height: '45px', padding: '0 15px' }} 

                                        value={companyName}

                                        onChange={(e) => setCompanyName(e.target.value)}

                                    />

                                </>

                            )}

                        </div>



                        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '15px', marginTop: '20px' }}>

                            <button className="cancel-btn" onClick={() => { setActiveModal(null); setEmploymentStatus(''); }} style={{ padding: '10px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>

                            <button className="primary-btn" onClick={handleSaveJobUpdate} style={{ padding: '10px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', border: 'none', whiteSpace: 'nowrap' }}>Save Changes</button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}