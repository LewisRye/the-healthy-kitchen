import { useState } from "react";

const Navbar = ({ setScene }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  const modelScene = (sceneName) => {
    setDropdownOpen(false);
    setScene(sceneName);
  };

  return (
    <nav
      style={{
        backgroundColor: "#121212",
        padding: "1rem",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "100%",
          margin: "0 auto",
        }}
      >
        <ul
          style={{
            display: "flex",
            gap: "1rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
            justifyContent: "center",
            flexGrow: 1,
          }}
        >
          <li>
            <button
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
                textDecoration: "none",
                paddingInline: "1rem",
              }}
            >
              Foodstore
            </button>
          </li>
          <li>
            <button
              onClick={() => setScene("home")}
              style={{
                background: "none",
                border: "none",
                color: "#94a3b8",
                fontSize: "1rem",
                cursor: "pointer",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#60a5fa")}
              onMouseLeave={(e) => (e.target.style.color = "#94a3b8")}
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => setScene("about")}
              style={{
                background: "none",
                border: "none",
                color: "#94a3b8",
                fontSize: "1rem",
                cursor: "pointer",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#60a5fa")}
              onMouseLeave={(e) => (e.target.style.color = "#94a3b8")}
            >
              About
            </button>
          </li>
          <li>
            <button
              onClick={toggleDropdown}
              style={{
                background: "none",
                border: "none",
                color: "#94a3b8",
                fontSize: "1rem",
                cursor: "pointer",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#60a5fa")}
              onMouseLeave={(e) => (e.target.style.color = "#94a3b8")}
            >
              Models ▽
            </button>

            {isDropdownOpen && (
              <ul
                style={{
                  position: "absolute",
                  backgroundColor: "#1e293b",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  marginTop: "0.5rem",
                  listStyle: "none",
                  zIndex: 10,
                }}
              >
                <li>
                  <button
                    onClick={() => modelScene("banana")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#94a3b8",
                      cursor: "pointer",
                      fontSize: "1rem",
                      marginBottom: "1rem",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#60a5fa")}
                    onMouseLeave={(e) => (e.target.style.color = "#94a3b8")}
                  >
                    Banana
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => modelScene("cherry")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#94a3b8",
                      cursor: "pointer",
                      fontSize: "1rem",
                      marginBottom: "1rem",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#60a5fa")}
                    onMouseLeave={(e) => (e.target.style.color = "#94a3b8")}
                  >
                    Cherry
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => modelScene("grape")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#94a3b8",
                      cursor: "pointer",
                      fontSize: "1rem",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#60a5fa")}
                    onMouseLeave={(e) => (e.target.style.color = "#94a3b8")}
                  >
                    Grape
                  </button>
                </li>
              </ul>
            )}
          </li>
          <li>
            <button
              onClick={() => setScene("statement")}
              style={{
                background: "none",
                border: "none",
                color: "#94a3b8",
                fontSize: "1rem",
                cursor: "pointer",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#60a5fa")}
              onMouseLeave={(e) => (e.target.style.color = "#94a3b8")}
            >
              Statement of Originality
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
