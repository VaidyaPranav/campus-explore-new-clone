import { useNavigate } from "react-router-dom";
import "../App.css"
let Firstif = () => {
    const navigate = useNavigate();

    const Handlehod = () => {
        navigate("/hodlogin");
    };

    const Handefac = () => {
        navigate("/facultylogin");
    };

    const Handestu = () => {
        navigate("/studentlogin");
    };

    return (
        <>
        <header className="custom-header py-4">
        <div className="container d-flex flex-wrap justify-content-center align-items-center">
          <a href="/" className="d-flex align-items-center me-lg-auto text-decoration-none flex-wrap">
            <img src="jntuhlogo1.png" alt="JNTU Logo" className="logo-img" />
            <span className="fs-4 ms-3">
              <div className="university-title fw-bold" style={{ color: 'rgb(156,0,204)', fontSize: '1.1rem' }}>
                JAWAHARLAL NEHRU TECHNOLOGICAL UNIVERSITY HYDERABAD
              </div>
              <div className="college-title" style={{ color: 'rgb(156,0,204)', fontWeight: 500 }}>
                UNIVERSITY COLLEGE OF ENGINEERING JAGTIAL (AUTONOMOUS)
              </div>
              <div className="address text-muted" style={{ fontSize: '0.95rem' }}>
                Nachupally (Kondagattu), Kodimial Mandal, Jagtial Dist. Telangana - 505 501
              </div>
            </span>
          </a>
          <form className="search-form ms-4" role="search" style={{ maxWidth: 250, width: '100%' }}>
            
          </form>
        </div>
      </header>
           
            <div className="firstif-container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)" }}>
                <div className="bigbox" style={{ marginTop:"5rem", background: "#fff", borderRadius: "1rem", boxShadow: "0 4px 24px rgba(44,62,80,0.08)", display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center" }}>
                    <button onClick={Handlehod} className="btn btn-primary d-inline-flex align-items-center" type="button" style={{ width: "180px", fontSize: "1.1rem", fontWeight: "500", borderRadius: "0.5rem" }}>
                        HOD
                    </button>
                    <button onClick={Handefac} className="btn btn-primary d-inline-flex align-items-center" type="button" style={{ width: "180px", fontSize: "1.1rem", fontWeight: "500", borderRadius: "0.5rem" }}>
                        Faculty
                    </button>
                    <button onClick={Handestu} className="btn btn-primary d-inline-flex align-items-center" type="button" style={{ width: "180px", fontSize: "1.1rem", fontWeight: "500", borderRadius: "0.5rem" }}>
                        Student
                    </button>
                </div>
            </div>
        </>
    );
}
export default Firstif;