import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { canManageUsers, ROLE_LABELS } from "@/lib/roles";
import { readSessionFromCookieStore } from "@/lib/session";

export const metadata = { title: "Users" };
export const dynamic = "force-dynamic";

export default async function UsersPage({ searchParams }) {
  const session = await readSessionFromCookieStore();
  if (!session || !canManageUsers(session.role)) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";
  const created = params.created === "1";

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      lockedUntil: true,
      createdAt: true,
    },
  });

  return (
    <>
      <h1 className="h3 mb-4">Staff accounts</h1>
      {created ? (
        <div className="alert alert-success">User created.</div>
      ) : null}
      {error ? (
        <div className="alert alert-danger">{decodeURIComponent(error)}</div>
      ) : null}

      <div className="card card-section mb-4">
        <div className="card-body">
          <h2 className="h5 mb-3">Create user</h2>
          <form method="post" action="/api/users" className="row g-3">
            <div className="col-md-4">
              <label className="form-label" htmlFor="name">
                Name
              </label>
              <input className="form-control" id="name" name="name" required />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                className="form-control"
                id="email"
                name="email"
                type="email"
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="role">
                Role
              </label>
              <select className="form-select" id="role" name="role" required>
                <option value="EDITOR">Editor</option>
                <option value="PUBLISHER">Publisher</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="col-md-8">
              <label className="form-label" htmlFor="password">
                Temporary password
              </label>
              <input
                className="form-control"
                id="password"
                name="password"
                type="password"
                minLength={12}
                required
              />
              <div className="form-text">At least 12 characters.</div>
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button className="btn btn-primary w-100" type="submit">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card card-section">
        <div className="table-responsive">
          <table className="table table-striped mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{ROLE_LABELS[user.role]}</td>
                  <td>
                    {user.lockedUntil && user.lockedUntil > new Date()
                      ? "Locked"
                      : "Active"}
                  </td>
                  <td>{user.createdAt.toISOString().slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
