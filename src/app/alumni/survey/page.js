'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './survey.css';
import '../alumni-globals.css';

export default function DynamicPOSurvey() {
    const router = useRouter();
    const [answers, setAnswers] = useState({});
    
    const [surveyTitle, setSurveyTitle] = useState('');
    const [surveyDesc, setSurveyDesc] = useState('');
    const [surveyQuestions, setSurveyQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const existingSchema = localStorage.getItem('obe_form_po');
        
        if (existingSchema) {
            const parsed = JSON.parse(existingSchema);
            setSurveyTitle(parsed.title || 'Program Outcomes Survey');
            setSurveyDesc(parsed.desc || 'Evaluate your proficiency.');
            setSurveyQuestions(parsed.questions || []);
        } else {
            // Fallback kung hindi pa nagse-save si PC
            setSurveyTitle('Program Outcomes Survey (PO)');
            setSurveyDesc('Evaluate your proficiency based on the scale: 1 (Lowest) to 5 (Highest).');
            setSurveyQuestions([
                { id: 'q1', type: 'likert', text: '1. How well can you apply mathematics to engineering problems?' },
                { id: 'q2', type: 'yesno', text: '2. Did the curriculum prepare you for industrial standards?' },
                { id: 'q3', type: 'text', text: '3. What specific skills learned were most useful in your first job?' }
            ]);
        }
        setIsLoading(false);
    }, []);

    const totalQuestions = surveyQuestions.length;
    const answeredQuestions = Object.keys(answers).filter(key => answers[key] !== undefined && answers[key] !== '').length;
    const progressPercent = totalQuestions === 0 ? 0 : Math.round((answeredQuestions / totalQuestions) * 100);

    const handleOptionChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = () => {
        if (answeredQuestions < totalQuestions) {
            alert('Please complete all questions before submitting.');
            return;
        }

        const session = JSON.parse(localStorage.getItem('current_user') || '{}');
        const db = JSON.parse(localStorage.getItem('obe_masterlist') || '[]');

        if (session && session.id) {
            const updatedDb = db.map(student => {
                if (student.id === session.id) {
                    return { ...student, surveyProgress: '100%' };
                }
                return student;
            });

            localStorage.setItem('obe_masterlist', JSON.stringify(updatedDb));
            alert('Survey Submitted Successfully! Your progress is now 100%.');
            router.push('/alumni');
        } else {
            alert('Session expired. Please log in again.');
            router.push('/');
        }
    };

    if (isLoading) return <div style={{ color: 'white', padding: '50px', textAlign: 'center' }}>Loading Survey Configuration...</div>;

    return (
        <div className="portal-layout">
            <main className="main-content" style={{ overflowY: 'auto', padding: '40px 40px 40px 40px', position: 'relative' }}>
                
                <div style={{ position: 'fixed', right: '40px', top: '50%', transform: 'translateY(-50%)', width: '340px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', padding: '25px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', zIndex: 100 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: 'var(--text-sub)', fontSize: '1.2rem' }}>⚙️</span>
                            <span style={{ color: 'var(--text-main)', fontSize: '1rem', fontWeight: '500' }}>Completion Progress</span>
                        </div>
                    </div>
                    <div style={{ fontSize: '3.5rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '15px' }}>{progressPercent}<span style={{ fontSize: '1.8rem', color: 'var(--text-sub)' }}>%</span></div>
                    <div style={{ width: '100%', height: '24px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '20px' }}>
                        <div style={{ height: '100%', width: `${progressPercent}%`, backgroundColor: 'var(--gold)', borderRadius: '12px', transition: 'width 0.4s' }}></div>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>Submit the form to sync your final status.</p>
                </div>

                <div className="survey-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    
                    {/* DYNAMIC TITLE AT DESC GALING KAY PC */}
                    <div className="portal-card" style={{ padding: '30px', marginBottom: '25px', borderTop: '6px solid var(--gold)', borderRadius: '12px' }}>
                        <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '10px' }}>{surveyTitle}</h1>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-sub)', lineHeight: '1.5' }}>{surveyDesc}</p>
                    </div>

                    {surveyQuestions.map((q, index) => (
                        <div key={q.id} className="portal-card" style={{ marginBottom: '25px', padding: '30px' }}>
                            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '25px', lineHeight: '1.5' }}>
                                {index + 1}. {q.text}
                            </h3>

                            {q.type === 'likert' && (
                                <div className="likert-scale" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '500px', margin: '0 auto' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>Lowest</span>
                                    {[1, 2, 3, 4, 5].map(val => (
                                        <label key={val} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                                            <input type="radio" name={q.id} onChange={() => handleOptionChange(q.id, val)} checked={answers[q.id] === val} style={{ width: '22px', height: '22px', accentColor: 'var(--gold)', marginBottom: '5px' }} />
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '500' }}>{val}</span>
                                        </label>
                                    ))}
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>Highest</span>
                                </div>
                            )}

                            {q.type === 'yesno' && (
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}><input type="radio" name={q.id} onChange={() => handleOptionChange(q.id, 'Yes')} checked={answers[q.id] === 'Yes'} style={{ width: '20px', height: '20px', accentColor: 'var(--gold)' }} /> <span style={{ color: 'var(--text-main)' }}>Yes</span></label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}><input type="radio" name={q.id} onChange={() => handleOptionChange(q.id, 'No')} checked={answers[q.id] === 'No'} style={{ width: '20px', height: '20px', accentColor: 'var(--gold)' }} /> <span style={{ color: 'var(--text-main)' }}>No</span></label>
                                </div>
                            )}

                            {q.type === 'text' && (
                                <textarea className="correction-textbox" style={{ width: '100%', height: '80px', padding: '15px', border: '1px solid var(--border-color)', borderRadius: '8px' }} placeholder="Type your response here..." onChange={(e) => handleOptionChange(q.id, e.target.value)} value={answers[q.id] || ''}></textarea>
                            )}
                        </div>
                    ))}

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px', borderTop: '1px solid var(--border-color)', paddingTop: '40px', paddingBottom: '60px' }}>
                        <button className="outline-btn" onClick={() => router.back()} style={{ padding: '15px 40px', borderRadius: '8px', fontWeight: 'bold' }}>Cancel</button>
                        <button className="primary-btn" onClick={handleSubmit} disabled={progressPercent !== 100} style={{ padding: '15px 60px', borderRadius: '8px', border: 'none', fontWeight: 'bold', opacity: progressPercent === 100 ? 1 : 0.5, cursor: progressPercent === 100 ? 'pointer' : 'not-allowed' }}>Submit Evaluation</button>
                    </div>

                </div>
            </main>
        </div>
    );
}