import styles from "./topmenu.module.css";
import TopMenuItem from "./TopMenuItem";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function TopMenu() {
  const session = await getServerSession(authOptions);

  return (
    <div className={styles.menucontainer}>
      <div className="flex flex-row justify-between w-full items-center">
        <div>
          <TopMenuItem title="Home" pageRef="/" />
        </div>
        <div className="flex flex-row justify-end items-center gap-2">
          {session?.user.role === "admin" ? (
            <>
              <TopMenuItem
                title="Create Co-Working Space"
                pageRef="/addcoworking"
              />
              <TopMenuItem title="Manage Users" pageRef="/banuser" />
            </>
          ) : null}
          <TopMenuItem title="View Co-Working Space(s)" pageRef="/coworking" />
          <TopMenuItem title="Book Co-Working Space" pageRef="/booking" />
          {session?.user.role === "admin" ? (
            <TopMenuItem title="Manage Booking" pageRef="/mybooking" />
          ) : (
            <TopMenuItem title="My Booking" pageRef="mybooking" />
          )}
          {session ? (
            <TopMenuItem
              title={`Sign out of ${session.user?.username}`}
              pageRef="/api/auth/signout"
            />
          ) : (
            <div className="flex flex-row gap-2">
              <TopMenuItem title="Sign in" pageRef="/api/auth/signin" />
              <TopMenuItem title="Register" pageRef="/api/auth/register" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
