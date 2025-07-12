import { Outlet } from "react-router-dom";
import Footer from "../../components/footer/footer"

export default function GuestLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <main className="flex flex-1 items-center justify-center">
        <Outlet/>
      </main>
      <Footer/>
    </div>
  );
}
