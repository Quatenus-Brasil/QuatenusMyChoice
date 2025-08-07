import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Footer from "./components/Footer.jsx";
import Families from "./pages/family/Families.jsx";
import CreateFamily from "./pages/family/CreateFamily.jsx";
import SeeMoreFamily from "./pages/family/SeeMoreFamily.jsx";
import EditFamily from "./pages/family/EditFamily.jsx";
import DeleteFamily from "./pages/family/DeleteFamily.jsx";
import Bom from "./pages/logistics-sector/Bom.jsx";
import SearchBom from "./pages/logistics-sector/SearchBom.jsx";
import CreateBom from "./pages/logistics-sector/CreateBom.jsx";
import EditBom from "./pages/logistics-sector/EditBom.jsx";
import DeleteBom from "./pages/logistics-sector/DeleteBom.jsx";
import Faq from "./pages/faq/Faq.jsx";
import Panel from "./pages/Panel.jsx";
import UserPanel from "./pages/UserPanel.jsx";
import NotFound from "./pages/NotFound.jsx";
import { UserContext } from "./context/userContext.jsx";
import ProtectedRoute from "./components/routes/ProtectedRoute.jsx";
import AdminRoute from "./components/routes/AdminRoute.jsx";
import RoleBasedRoute from "./components/routes/RoleBasedRoute.jsx";
import ManagerRoute from "./components/routes/ManagerRoute.jsx";
import ActiveAccountRoute from "./components/routes/ActiveAccountRoute.jsx";
import SearchProvider from "./context/searchContext.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

function App() {
  const { user } = useContext(UserContext);
  return (
    <>
      <BrowserRouter>
        <SearchProvider>
          <ScrollToTop />
          <Navbar />
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }} className="bg-light">
            <main>
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute user={user}>
                      <ActiveAccountRoute>
                        <Home />
                      </ActiveAccountRoute>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/families"
                  element={
                    <ProtectedRoute user={user}>
                      <ActiveAccountRoute>
                        <Families />
                      </ActiveAccountRoute>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/family/seemore/:id"
                  element={
                    <ProtectedRoute user={user}>
                      <ActiveAccountRoute>
                        <SeeMoreFamily />
                      </ActiveAccountRoute>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/family/create"
                  element={
                    <ProtectedRoute user={user}>
                      <AdminRoute user={user}>
                        <ActiveAccountRoute>
                          <CreateFamily />
                        </ActiveAccountRoute>
                      </AdminRoute>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/family/edit/:id"
                  element={
                    <ProtectedRoute user={user}>
                      <AdminRoute user={user}>
                        <ActiveAccountRoute>
                          <EditFamily />
                        </ActiveAccountRoute>
                      </AdminRoute>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/family/delete/:id"
                  element={
                    <ProtectedRoute user={user}>
                      <AdminRoute user={user}>
                        <ActiveAccountRoute>
                          <DeleteFamily />
                        </ActiveAccountRoute>
                      </AdminRoute>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/logistics-sector/bom"
                  element={
                    <ProtectedRoute user={user}>
                      <RoleBasedRoute user={user} roles={["técnica", "logística"]}>
                        <ActiveAccountRoute>
                          <Bom />
                        </ActiveAccountRoute>
                      </RoleBasedRoute>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/logistics-sector/bom/search/:qbmCode"
                  element={
                    <ProtectedRoute user={user}>
                      <RoleBasedRoute user={user} roles={["técnica", "logística"]}>
                        <ActiveAccountRoute>
                          <SearchBom />
                        </ActiveAccountRoute>
                      </RoleBasedRoute>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/logistics-sector/bom/create"
                  element={
                    <ProtectedRoute user={user}>
                      <RoleBasedRoute user={user} roles={["técnica", "logística"]}>
                        <ManagerRoute user={user}>
                          <ActiveAccountRoute>
                            <CreateBom />
                          </ActiveAccountRoute>
                        </ManagerRoute>
                      </RoleBasedRoute>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/logistics-sector/bom/edit/:id"
                  element={
                    <ProtectedRoute user={user}>
                      <RoleBasedRoute user={user} roles={["técnica", "logística"]}>
                        <ManagerRoute user={user}>
                          <ActiveAccountRoute>
                            <EditBom />
                          </ActiveAccountRoute>
                        </ManagerRoute>
                      </RoleBasedRoute>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/logistics-sector/bom/delete/:id"
                  element={
                    <ProtectedRoute user={user}>
                      <RoleBasedRoute user={user} roles={["técnica", "logística"]}>
                        <ManagerRoute user={user}>
                          <ActiveAccountRoute>
                            <DeleteBom />
                          </ActiveAccountRoute>
                        </ManagerRoute>
                      </RoleBasedRoute>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/faq"
                  element={
                    <ProtectedRoute user={user}>
                      <ActiveAccountRoute>
                        <Faq />
                      </ActiveAccountRoute>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/panel"
                  element={
                    <ProtectedRoute user={user}>
                      <AdminRoute user={user}>
                        <ActiveAccountRoute>
                          <Panel />
                        </ActiveAccountRoute>
                      </AdminRoute>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/panel/users"
                  element={
                    <ProtectedRoute user={user}>
                      <AdminRoute user={user}>
                        <ActiveAccountRoute>
                          <UserPanel />
                        </ActiveAccountRoute>
                      </AdminRoute>
                    </ProtectedRoute>
                  }
                />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </SearchProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
