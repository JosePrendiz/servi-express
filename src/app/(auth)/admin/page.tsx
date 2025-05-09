'use client'
import React, { useEffect, useState } from "react";
import { adminAPI } from "app/axios";
import { User, DisplayReportData } from "app/interfaces";
import Loading from "@/components/loader";

export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [reports, setReports] = useState<DisplayReportData[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState({ users: 1, reports: 1 });
    const [totalPages, setTotalPages] = useState({ users: 1, reports: 1 });
    const [currentDisplay, setCurrentDisplay] = useState<"users" | "reports">("users");
    const ELEMENTS_PER_PAGE_LIMIT = "10";

    const fetchData = async (type: "users" | "reports", page: number) => {
        setLoading(true);
        try {
            const response =
                type === "users"
                    ? await adminAPI.getAllUsers(page.toString(), ELEMENTS_PER_PAGE_LIMIT)
                    : await adminAPI.getAllReports(page.toString(), ELEMENTS_PER_PAGE_LIMIT);

            if (type === "users") {
                setUsers(response.users);
                setTotalPages((prev) => ({ ...prev, users: response.totalPages }));
            } else {
                setReports(response.reports);
                setTotalPages((prev) => ({ ...prev, reports: response.totalPages }));
            }
        } catch (error) {
            console.error(`Failed to fetch ${type}:`, error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentDisplay, currentPage[currentDisplay]);
    }, [currentDisplay, currentPage]);

    const toggleBan = async (userId: string) => {
        try {
            await adminAPI.banUser(userId);
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === userId ? { ...user, isBanned: !user.isBanned } : user
                )
            );
        } catch (error) {
            console.error("Failed to toggle ban:", error);
        }
    };

    const changePage = (type: "users" | "reports", direction: "prev" | "next") => {
        setCurrentPage((prev) => ({
            ...prev,
            [type]: direction === "prev" ? prev[type] - 1 : prev[type] + 1,
        }));
    };

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

    if (loading) return <Loading message="Loading Data" />;

    return (
        <div className="p-6" style={{ color: "#000", textAlign: "center" }}>
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
            <button
                onClick={() => setCurrentDisplay((prev) => (prev === "users" ? "reports" : "users"))}
                className="no-bkgd"
            >
                {currentDisplay === "users" ? "Check Reports" : "Check Users"}
            </button>
            <div>
                <table className="w-full border bg-white rounded shadow">
                    <thead className="bg-gray-200">
                        <tr>
                            {currentDisplay === "users" ? (
                                <>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Phone</th>
                                    <th className="p-3">Role</th>
                                    <th className="p-3">Is Banned</th>
                                    <th className="p-3">Actions</th>
                                </>
                            ) : (
                                <>
                                    <th className="p-3">Report Title</th>
                                    <th className="p-3">Reporter Role</th>
                                    <th className="p-3">Reporter</th>
                                    <th className="p-3">Reporter Email</th>
                                    <th className="p-3">Reported</th>
                                    <th className="p-3">Reported Email</th>
                                    <th className="p-3">Report Date</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {currentDisplay === "users"
                            ? users.map((user) => (
                                <tr key={user._id} className="border-t">
                                    <td className="p-3">{user.name}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{user.phone}</td>
                                    <td className="p-3">{user.role}</td>
                                    <td className="p-3">{user.isBanned ? "Yes" : "No"}</td>
                                    <td className="p-3">
                                        <button
                                            style={{ width: 100 }}
                                            onClick={() => toggleBan(user._id)}
                                            className={`${user.isBanned ? "dark-red-btn" : "dark-green-btn"
                                                }`}
                                        >
                                            {user.isBanned ? "Unban" : "Ban"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                            : reports.map((report) => (
                                <tr key={report._id} className="border-t">
                                    <td className="p-3">{report.title}</td>
                                    <td className="p-3">{report.reporterRole}</td>
                                    <td className="p-3">{report.reporterUserId.name}</td>
                                    <td className="p-3">{report.reporterUserId.email}</td>
                                    <td className="p-3">{report.reportedUserId.name}</td>
                                    <td className="p-3">{report.reportedUserId.email}</td>
                                    <td className="p-3">{formatDate(report.createdAt)}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                <div className="mt-4 flex justify-evenly">
                    <button
                        onClick={() => changePage(currentDisplay, "prev")}
                        disabled={currentPage[currentDisplay] === 1}
                        className="pagination-button"
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage[currentDisplay]} of {totalPages[currentDisplay]}
                    </span>
                    <button
                        onClick={() => changePage(currentDisplay, "next")}
                        disabled={currentPage[currentDisplay] === totalPages[currentDisplay]}
                        className="pagination-button"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
