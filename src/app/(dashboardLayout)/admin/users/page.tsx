"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { adminClientService, type AdminUser } from "@/services/admin-client.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Users,
    Loader2,
    Shield,
    Mail,
    Phone,
    Search,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const STATUS_BADGE: Record<string, string> = {
    ACTIVATE: "bg-green-500/10 text-green-600 border-green-500/30",
    SUSPENDED: "bg-red-500/10 text-red-600 border-red-500/30",
    DEACTIVATED: "bg-gray-500/10 text-gray-600 border-gray-500/30",
};

const ROLE_BADGE: Record<string, string> = {
    CUSTOMER: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    PROVIDER: "bg-purple-500/10 text-purple-600 border-purple-500/30",
};

function UserCard({
    user,
    onStatusChange,
}: {
    user: AdminUser;
    onStatusChange: (id: string, status: string) => void;
}) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleStatusChange = async (newStatus: string) => {
        setIsUpdating(true);
        try {
            await adminClientService.updateUser(user.id, { status: newStatus });
            onStatusChange(user.id, newStatus);
            toast.success(`User ${newStatus === "ACTIVATE" ? "activated" : "suspended"}`);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update user");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{user.name}</h3>
                    <Badge variant="outline" className={ROLE_BADGE[user.role] || ""}>
                        {user.role}
                    </Badge>
                    <Badge variant="outline" className={STATUS_BADGE[user.status] || ""}>
                        {user.status}
                    </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Mail className="size-3" />
                        {user.email}
                    </span>
                    {user.phone && (
                        <span className="flex items-center gap-1">
                            <Phone className="size-3" />
                            {user.phone}
                        </span>
                    )}
                    <span>
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Select
                    value={user.status}
                    onValueChange={handleStatusChange}
                    disabled={isUpdating}
                >
                    <SelectTrigger className="w-[150px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ACTIVATE">Activate</SelectItem>
                        <SelectItem value="SUSPENDED">Suspend</SelectItem>
                    </SelectContent>
                </Select>
                {isUpdating && <Loader2 className="size-4 animate-spin" />}
            </div>
        </div>
    );
}

export default function AdminUsersPage() {
    const { user, isPending } = useAuth();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("ALL");

    const fetchUsers = useCallback(async () => {
        try {
            setError(null);
            const data = await adminClientService.getUsers();
            setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load users");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isPending && user && user.role === "ADMIN") {
            fetchUsers();
        } else if (!isPending) {
            setLoading(false);
        }
    }, [isPending, user, fetchUsers]);

    const handleStatusChange = (id: string, status: string) => {
        setUsers((prev) =>
            prev.map((u) => (u.id === id ? { ...u, status } : u))
        );
    };

    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    if (isPending || loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!user || user.role !== "ADMIN") {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
                <Shield className="size-12 text-muted-foreground/40" />
                <h2 className="text-lg font-semibold">Admin Access Required</h2>
                <Button asChild>
                    <Link href="/">Go Home</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold sm:text-3xl">Manage Users</h1>
                <p className="text-muted-foreground">
                    {users.length} user{users.length !== 1 && "s"} total
                </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Roles</SelectItem>
                        <SelectItem value="CUSTOMER">Customer</SelectItem>
                        <SelectItem value="PROVIDER">Provider</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Separator />

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                    {error}
                    <Button variant="link" className="ml-2 h-auto p-0" onClick={fetchUsers}>
                        Retry
                    </Button>
                </div>
            )}

            {filteredUsers.length === 0 && !error ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
                    <Users className="mb-4 size-12 text-muted-foreground/40" />
                    <h2 className="mb-2 text-lg font-semibold">No users found</h2>
                    <p className="text-sm text-muted-foreground">
                        {search || roleFilter !== "ALL"
                            ? "Try adjusting your filters."
                            : "No users registered yet."}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredUsers.map((u) => (
                        <UserCard
                            key={u.id}
                            user={u}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
