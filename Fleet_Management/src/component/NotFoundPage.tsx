import React from "react";
import pic from "../assets/404.webp";
const NotFoundPage: React.FC = () => {
  return (
    <div style={styles.container}>
      <img src={pic} width={160} />
      <h1 style={styles.header}>404</h1>
      <p style={styles.text}>
        Oops! The page you're looking for doesn't exist.
      </p>
      <a href="/app/new-home-page" style={styles.link}>
        Go back to the homepage
      </a>{" "}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as "column",
    justifyContent: "center",
    alignItems: "center",
    height: "75vh",
    margin: 0,
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#effaef",
    color: "#333",
    textAlign: "center" as "center",
  },
  header: {
    fontSize: "6em",
    margin: 0,
  },
  text: {
    fontSize: "1.5em",
    margin: "20px 0",
  },
  link: {
    fontSize: "1.2em",
    color: "#007BFF",
    textDecoration: "none" as "none",
  },
};

export default NotFoundPage;
