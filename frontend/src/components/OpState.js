import React, { useState } from "react";
import Task from "./Task";

const OpState = () => {
    const [activeTab, setActiveTab] = useState("preop");
    const [nurses, setNurses] = useState(["Susan", "Elizabeth"]);
    const [showModal, setShowModal] = useState(false);
    const [selectedNurses, setSelectedNurses] = useState([...nurses]);
    const [aiData, setAiData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFetchAISuggestions = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const payload = {
                requested_date: "2024-05-03",
                requested_start: "10:00",
                requested_end: "12:00",
                required_test_type: "MRI",
                required_nurses: 2,
                required_operation_rooms: 1,
                time_constraint_type: "exact"
            };

            console.log("📤 Sending request body:", payload);

            const res = await fetch("http://localhost:8000/check-availability/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            console.log("✅ Response received:", data);
            setAiData(data);
        } catch (err) {
            console.error("AI Suggestion fetch failed:", err);
            setAiData({ error: "Failed to load suggestions." });
        } finally {
            setLoading(false);
        }
    };


    const handleSave = () => {
        setNurses(selectedNurses);
        setShowModal(false);
    };

    const handleNurseChange = (index, newName) => {
        const updated = [...selectedNurses];
        updated[index] = newName;
        setSelectedNurses(updated);
    };

    const nurseTasksPreOp = Object.fromEntries(
        selectedNurses.map((name, i) => [
            name,
            i === 0
                ? [
                    { label: "Check BP every 4 hours", status: "completed", time: "08:00", note: "Stable vitals" },
                    { label: "Administer medication", status: "in_progress", time: "09:00", note: "Given half dose" },
                ]
                : [
                    { label: "Pre-op patient preparation", status: "pending", time: "08:30", note: "To start soon" },
                    { label: "Patient education", status: "completed", time: "07:50", note: "Explained procedure" },
                ]
        ])
    );

    const doctorTasksPreOp = {
        "Dr. Martinez": [
            { label: "Review lab results", status: "completed", time: "07:30", note: "No concerns" },
            { label: "Obtain informed consent", status: "in_progress", time: "08:10", note: "Halfway done" },
        ],
        "Dr. Wong": [
            { label: "Coordinate with anesthesia team", status: "pending", time: "09:00", note: "Waiting for update" },
        ],
    };

    const nurseTasksSurgery = {
        Susan: [
            { label: "Monitor vitals", status: "in_progress", time: "11:00", note: "HR stable" },
            { label: "Manage IV fluids", status: "completed", time: "10:45", note: "Fluids replaced" },
        ],
    };

    const doctorTasksSurgery = {
        "Dr. Wong": [
            { label: "Perform procedure", status: "pending", time: "12:00", note: "Scheduled after prep" },
        ],
    };

    const nurseTasksPostOp = {
        Elizabeth: [
            { label: "Pain assessment", status: "pending", time: "14:00", note: "To follow-up" },
            { label: "Discharge instructions", status: "in_progress", time: "15:00", note: "Started briefing" },
        ],
    };

    const renderTabs = () => (
        <div className="flex space-x-6 border-b mb-6">
            {["preop", "surgery", "postop"].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 font-medium ${activeTab === tab
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
            ))}
        </div>
    );

    const renderPreOpLayout = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Suggestions Panel */}
            <div className="col-span-1 bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col justify-between">
                <div>
                    <h3 className="text-md font-semibold text-gray-800 mb-3">AI Suggestions</h3>

                    {!aiData && !loading && (
                        <p className="text-sm text-gray-500 mb-6">Suggestions will appear here...</p>
                    )}

                    {loading && (
                        <p className="text-sm text-gray-500 mb-6">Loading...</p>
                    )}

                    {aiData && !aiData.error && (
                        <div className="space-y-4 text-sm text-gray-800">
                            {/* Date & Time */}
                            <div className="bg-white rounded-lg border shadow-sm p-4">
                                <div className="font-semibold text-xs text-gray-500 uppercase mb-1">Date & Time</div>
                                <p className="flex items-center gap-2">
                                    📅 <span>{aiData.date}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    ⏰ <span>{aiData.start} – {aiData.end}</span>
                                </p>
                            </div>

                            {/* Nurses */}
                            <div className="bg-white rounded-lg border shadow-sm p-4">
                                <div className="font-semibold text-xs text-gray-500 uppercase mb-2">Nurses</div>
                                <div className="space-y-2 text-sm text-gray-700">
                                    {aiData.nurses_available.length > 0 ? (
                                        aiData.nurses_available.map((n, i) => (
                                            <div
                                                key={i}
                                                className="flex justify-between items-center bg-gray-50 px-3 py-2 border border-gray-200 rounded-md"
                                            >
                                                <div>
                                                    <div className="font-medium">{n.name}</div>
                                                    {n.email && <div className="text-xs text-gray-500">{n.email}</div>}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-xs text-gray-400">No data available</div>
                                    )}
                                </div>
                            </div>


                            {/* Radiologists */}
                            <div className="bg-white rounded-lg border shadow-sm p-4">
                                <div className="font-semibold text-xs text-gray-500 uppercase mb-1">Radiologists</div>
                                <div className="space-y-2 text-sm text-gray-700">
                                    {aiData.radiologists_available.length > 0 ? (
                                        aiData.radiologists_available.map((r, i) => (
                                            <div
                                                key={i}
                                                className="bg-gray-50 px-3 py-2 rounded-md border border-gray-200"
                                            >
                                                <div className="font-medium">{r.name}</div>
                                                {r.email && (
                                                    <div className="text-xs text-gray-500">{r.email}</div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-400">No radiologists available.</p>
                                    )}
                                </div>
                            </div>


                            {/* Equipment */}
                            <div className="bg-white rounded-lg border shadow-sm p-4">
                                <div className="font-semibold text-xs text-gray-500 uppercase mb-1">Equipment</div>
                                <div className="space-y-2 text-sm text-gray-700">
                                    {aiData.equipment_available.length > 0 ? (
                                        aiData.equipment_available.map((e, i) => (
                                            <div
                                                key={i}
                                                className="bg-gray-50 px-3 py-2 rounded-md border border-gray-200"
                                            >
                                                <div className="font-medium">{e.name}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-400">No equipment available.</p>
                                    )}
                                </div>
                            </div>


                            {/* Operation Theatres */}
                            <div className="bg-white rounded-lg border shadow-sm p-4">
                                <div className="font-semibold text-xs text-gray-500 uppercase mb-1">Operation Theatres</div>
                                <div className="space-y-2 text-sm text-gray-700">
                                    {aiData.operation_theatres_available.length > 0 ? (
                                        aiData.operation_theatres_available.map((ot, i) => (
                                            <div
                                                key={i}
                                                className="bg-gray-50 px-3 py-2 rounded-md border border-gray-200"
                                            >
                                                <div className="font-medium">{ot.name}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-400">No theatres available.</p>
                                    )}
                                </div>
                            </div>


                            {/* MRI Test Scores */}
                            <div className="bg-white rounded-lg border shadow-sm p-4">
                                <div className="font-semibold text-xs text-gray-500 uppercase mb-1">Latest MRI Test Score</div>
                                <div className="space-y-2 text-sm text-gray-700">
                                    {aiData.latest_test_scores.length > 0 ? (
                                        <div className="bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                                            <div className="flex justify-between">
                                                <span className="font-medium">Patient {aiData.latest_test_scores[0].patient_id}</span>
                                                <span>{aiData.latest_test_scores[0].score}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400">No test scores available.</p>
                                    )}
                                </div>
                            </div>



                            {/* Match Status */}
                            <div className="text-center bg-green-50 text-green-700 font-semibold text-sm px-3 py-2 rounded-md border border-green-200 shadow-sm">
                                ✅ {aiData.match_status}
                            </div>
                        </div>
                    )}


                    {aiData?.error && (
                        <p className="text-sm text-red-500">{aiData.error}</p>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-auto">
                    <button
                        onClick={handleFetchAISuggestions}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-full shadow"
                    >
                        AI Suggestion
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-full shadow">
                        Add to Task
                    </button>
                </div>
            </div>

            {/* Tasks Panel */}
            <div className="col-span-2">
                {renderTabs()}
                <p className="text-sm text-gray-600 mb-4">Pre-Op Tasks</p>
                <div className="text-right mb-4">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow hover:bg-blue-700">
                        + Generate Tasks
                    </button>
                </div>
                <Task
                    category="Nurses"
                    data={nurseTasksPreOp}
                    onEdit={() => setShowModal(true)}
                />
                <Task category="Assistant Doctors" data={doctorTasksPreOp} />
            </div>

            {/* Edit Staff Modal (unchanged) */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-96 space-y-4">
                        <h3 className="text-lg font-semibold">Edit Nurses</h3>
                        {selectedNurses.map((name, i) => (
                            <select
                                key={i}
                                value={name}
                                onChange={(e) => handleNurseChange(i, e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            >
                                {["Susan", "Elizabeth", "Jacob", "Sophia"].map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        ))}
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                className="px-4 py-2 text-sm border border-gray-300 rounded"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );


    const renderTabContent = () => {
        if (activeTab === "preop") return renderPreOpLayout();

        return (
            <>
                {renderTabs()}
                <p className="text-sm text-gray-600 mb-4">
                    {activeTab === "surgery" ? "Surgery Day Tasks" : "Post-Op Tasks"}
                </p>
                {activeTab === "surgery" && (
                    <>
                        <Task category="Nurses" data={nurseTasksSurgery} />
                        <Task category="Doctors" data={doctorTasksSurgery} />
                    </>
                )}
                {activeTab === "postop" && (
                    <>
                        <Task category="Nurses" data={nurseTasksPostOp} />
                    </>
                )}
            </>
        );
    };

    return <div className="mt-10">{renderTabContent()}</div>;
};

export default OpState;


