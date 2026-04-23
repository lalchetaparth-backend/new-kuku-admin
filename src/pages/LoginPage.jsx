import { useNavigate } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";

function LoginPage() {
  const navigate = useNavigate();

  useDocumentTitle("KUKU FOOD PRODUCTS - JAMNAGAR");

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-4 bg-body-tertiary">
      <main className="form-signin w-100 m-auto">
        <form onSubmit={handleSubmit}>
          <div className="m-auto w-50">
            <img
              className="mb-4 w-100"
              src="/assets/images/kuku-namkeen-logo.png"
              alt="Kuku Namkeen"
            />
          </div>
          <h1 className="h3 mb-3 fw-normal">Sign in</h1>
          <div className="form-floating">
            <input
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <button className="btn btn-primary w-100 py-2" type="submit">
            Sign in
          </button>
          <p className="mt-5 mb-3 text-body-secondary">&copy; 2025</p>
        </form>
      </main>
    </div>
  );
}

export default LoginPage;
