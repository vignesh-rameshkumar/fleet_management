import { useFrappeAuth } from "frappe-react-sdk";

export const Auth = () => {
  const {
    currentUser,
    isValidating,
    isLoading,
    login,
    logout,
    error,
    updateCurrentUser,
  } = useFrappeAuth();

  if (isLoading) return <div>loading.........</div>;

  // render user
  return (
    <div>
      {currentUser}
      <button
        onClick={
          // () => login({ username: "Administrator", password: "rajesh123" })
          // Team 1
          // () => login({ username: "testsa@agnikul.in", password: "Agnikul_1" })
          // () =>
          // login({ username: "tn18av7889@agnikul.in", password: "Agnikul_1" })
          // () =>
          // login({ username: "tn18av7099@agnikul.in", password: "Agnikul_1" })
          () => login({ username: "testfm@agnikul.in", password: "Agnikul_1" })
          // () => login({ username: "testdl@agnikul.in", password: "Agnikul_1" })
          // () => login({ username: "testpl@agnikul.in", password: "Agnikul_1" })
          // () => login({ username: "testpl2@agnikul.in", password: "Agnikul_1" })
          // () =>
          // login({ username: "testemp3@agnikul.in", password: "Agnikul_1" })
          // () =>
          // login({ username: "testemp2@agnikul.in", password: "Agnikul_1" })
          // () => login({ username: "testemp@agnikul.in", password: "Agnikul_1" })
          // () => login({ username: "user2@erp.in", password: "Agnikul_1" })
          // () => login({ username: "testpl@erp.in", password: "Agnikul_1" })
          // () => login({ username: "testhr@erp.in", password: "Agnikul_1" })
        }
      >
        {" "}
        Login
      </button>{" "}
      <br />
      <button onClick={logout}>Logout</button>
      {/* <button onClick={updateCurrentUser}>Fetch current user</button> */}
    </div>
  );
};
