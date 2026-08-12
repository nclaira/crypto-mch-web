"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, PlusCircle, Users, BookOpen, ShieldCheck, CheckCircle2, Pencil, X } from "lucide-react";
import Footer from "@/components/Footer";
import { UploadButton } from "@/lib/uploadthing";
import { useCryptoAuth } from "@/lib/auth";

interface UserType {
  _id: string;
  username: string;
  email: string;
  role: string;
  isPaid: boolean;
  createdAt: string;
}

interface BookType {
  _id: string;
  title: string;
  author: string;
  category: string;
  accessType: string;
  price: number;
  type: string;
  description?: string;
  previewUrl?: string;
  pdfUrl?: string;
}

const emptyForm = {
  title: "",
  author: "",
  category: "Crypto Trading",
  accessType: "Paid",
  price: 5000,
  type: "ebook",
  description: "",
  previewUrl: "",
  pdfUrl: "",
};

export default function AdminDashboard() {
  const { user, ready } = useCryptoAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"users" | "books">("users");
  const [users, setUsers] = useState<UserType[]>([]);
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingBook, setEditingBook] = useState<BookType | null>(null);

  // Guard: redirect non-admins only after auth has hydrated from localStorage
  useEffect(() => {
    if (!ready) return;
    if (!user || user.role !== "admin") router.replace("/login");
  }, [ready, user, router]);

  // Fetch data only when confirmed admin
  useEffect(() => {
    if (!ready || !user || user.role !== "admin") return;
    fetchData();
  }, [ready, user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resUsers, resBooks] = await Promise.all([
        fetch("/api/admin/users", { credentials: "include" }),
        fetch("/api/admin/books", { credentials: "include" }),
      ]);
      const dataUsers = await resUsers.json();
      const dataBooks = await resBooks.json();
      if (dataUsers.success) setUsers(dataUsers.users);
      if (dataBooks.success) setBooks(dataBooks.books);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditBook = (b: BookType) => {
    setEditingBook(b);
    setFormData({
      title: b.title,
      author: b.author,
      category: b.category || "Crypto Trading",
      accessType: b.accessType,
      price: b.price,
      type: b.type,
      description: b.description || "",
      previewUrl: b.previewUrl || "",
      pdfUrl: b.pdfUrl || "",
    });
    setActiveTab("books");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingBook(null);
    setFormData(emptyForm);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.success) setUsers((prev) => prev.filter((u) => u._id !== userId));
      else alert(data.error || "Failed to delete user");
    } catch {
      alert("Error deleting user");
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch("/api/admin/books", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });
      const data = await res.json();
      if (data.success) setBooks((prev) => prev.filter((b) => b._id !== bookId));
      else alert(data.error || "Failed to delete item");
    } catch {
      alert("Error deleting item");
    }
  };

  const handleSubmitBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingBook) {
        const res = await fetch(`/api/admin/books/${editingBook._id}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          setBooks((prev) => prev.map((b) => (b._id === editingBook._id ? data.book : b)));
          setEditingBook(null);
          setFormData(emptyForm);
        } else {
          alert(data.error || "Failed to update item");
        }
        return;
      }

      const res = await fetch("/api/admin/books", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        alert("Resource published successfully!");
        setBooks((prev) => [data.book, ...prev]);
        setFormData(emptyForm);
      } else {
        alert(data.error || "Error publishing resource");
      }
    } catch {
      alert("Error connecting to server");
    } finally {
      setSaving(false);
    }
  };

  // Show spinner until auth hydrates — prevents false redirect / empty-data flash
  if (!ready || !user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d1117]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#d4af37] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16">

        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#d4af37]/20 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-[#d4af37]" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#f3e5ab] bg-clip-text text-transparent">
                Control Panel
              </h1>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Manage accounts, upload eBooks/Videos, and track system resources.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                activeTab === "users"
                  ? "bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20"
                  : "bg-[#161b22] text-gray-300 hover:text-white"
              }`}
            >
              <Users className="h-4 w-4" /> Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("books")}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                activeTab === "books"
                  ? "bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20"
                  : "bg-[#161b22] text-gray-300 hover:text-white"
              }`}
            >
              <BookOpen className="h-4 w-4" /> Library Items ({books.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Users */}
        {activeTab === "users" && (
          <div className="mt-8 rounded-2xl border border-[#d4af37]/20 bg-[#161b22] p-6 shadow-xl">
            <h2 className="text-xl font-bold text-[#f3e5ab] mb-4">Registered Accounts</h2>
            {loading ? (
              <p className="text-gray-400">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="text-gray-400">No users registered yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="border-b border-gray-700 bg-[#0d1117] text-xs uppercase text-[#d4af37]">
                    <tr>
                      <th className="p-4">User</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Payment Status</th>
                      <th className="p-4">Joined Date</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-800/50 transition">
                        <td className="p-4 font-semibold text-white">{u.username}</td>
                        <td className="p-4">{u.email}</td>
                        <td className="p-4">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            u.role === "admin"
                              ? "bg-purple-900/50 text-purple-300 border border-purple-500/30"
                              : "bg-gray-800 text-gray-400"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            u.isPaid
                              ? "bg-green-900/40 text-green-400 border border-green-500/30"
                              : "bg-yellow-900/40 text-yellow-400 border border-yellow-500/30"
                          }`}>
                            {u.isPaid ? "Paid Member" : "Free User"}
                          </span>
                        </td>
                        <td className="p-4 text-gray-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
                            title="Delete User"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Books */}
        {activeTab === "books" && (
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="rounded-2xl border border-[#d4af37]/20 bg-[#161b22] p-6 shadow-xl lg:col-span-1">
              <h2 className="text-xl font-bold text-[#f3e5ab] mb-4 flex items-center gap-2">
                {editingBook ? (
                  <Pencil className="h-5 w-5 text-[#d4af37]" />
                ) : (
                  <PlusCircle className="h-5 w-5 text-[#d4af37]" />
                )}
                {editingBook ? "Edit Item" : "Upload New Item"}
              </h2>
              <form onSubmit={handleSubmitBook} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase">Title</label>
                  <input type="text" required value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-700 bg-[#0d1117] p-3 text-sm text-white focus:border-[#d4af37] focus:outline-none"
                    placeholder="e.g. Master Class Forex Strategy" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase">Author / Creator</label>
                  <input type="text" required value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-700 bg-[#0d1117] p-3 text-sm text-white focus:border-[#d4af37] focus:outline-none"
                    placeholder="e.g. Mucamanza Edu" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 uppercase">Type</label>
                    <select value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-700 bg-[#0d1117] p-3 text-sm text-white focus:border-[#d4af37] focus:outline-none">
                      <option value="ebook">eBook (PDF)</option>
                      <option value="video">Video Course</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase">Tier</label>
                    <select value={formData.accessType}
                      onChange={(e) => setFormData({ ...formData, accessType: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-700 bg-[#0d1117] p-3 text-sm text-white focus:border-[#d4af37] focus:outline-none">
                      <option value="Paid">Paid</option>
                      <option value="Free">Free</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase">Price (RWF)</label>
                  <input type="number" value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-gray-700 bg-[#0d1117] p-3 text-sm text-white focus:border-[#d4af37] focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase">File URL</label>
                  <input type="url" value={formData.pdfUrl}
                    onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-700 bg-[#0d1117] p-3 text-sm text-white focus:border-[#d4af37] focus:outline-none"
                    placeholder="https://... or upload below" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase">
                    {editingBook ? "Replace File (optional)" : "Upload File (PDF or Video)"}
                  </label>
                  <div className="mt-1 rounded-xl border border-gray-700 bg-[#0d1117] p-3">
                    <UploadButton
                      endpoint="docUploader"
                      onClientUploadComplete={(res) => {
                        if (res?.[0]?.url) setFormData((prev) => ({ ...prev, pdfUrl: res[0].url }));
                      }}
                      onUploadError={(error) => alert(`Upload failed: ${error.message}`)}
                    />
                    {formData.pdfUrl && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-green-400 break-all">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        {editingBook ? "File linked" : "File Ready to Publish"}
                      </p>
                    )}
                  </div>
                </div>
                <button type="submit" disabled={saving}
                  className="w-full rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] py-3 font-semibold text-black shadow-lg shadow-[#d4af37]/20 hover:scale-[1.01] transition disabled:opacity-60">
                  {saving
                    ? (editingBook ? "Updating..." : "Publishing...")
                    : (editingBook ? "Update Item" : "Publish to Library")}
                </button>
                {editingBook && (
                  <button type="button" onClick={handleCancelEdit}
                    className="w-full rounded-xl border border-gray-600 py-3 text-sm font-semibold text-gray-300 hover:border-gray-400 transition flex items-center justify-center gap-2">
                    <X className="h-4 w-4" /> Cancel Edit
                  </button>
                )}
              </form>
            </div>

            <div className="rounded-2xl border border-[#d4af37]/20 bg-[#161b22] p-6 shadow-xl lg:col-span-2">
              <h2 className="text-xl font-bold text-[#f3e5ab] mb-4">Published Library Content</h2>
              {loading ? (
                <p className="text-gray-400 text-sm">Loading library...</p>
              ) : books.length === 0 ? (
                <p className="text-gray-400 text-sm">No items published yet.</p>
              ) : (
                <div className="space-y-4">
                  {books.map((b) => (
                    <div key={b._id} className="flex items-center justify-between rounded-xl border border-gray-800 bg-[#0d1117] p-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase font-semibold text-[#d4af37] border border-[#d4af37]/30 px-2 py-0.5 rounded">
                            {b.type}
                          </span>
                          <h3 className="font-bold text-white">{b.title}</h3>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          By {b.author} • {b.accessType} • {b.price} RWF
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditBook(b)}
                          className="rounded-lg p-2 text-[#d4af37] hover:bg-[#d4af37]/10 transition"
                          title="Edit Item"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBook(b._id)}
                          className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
                          title="Delete Item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
