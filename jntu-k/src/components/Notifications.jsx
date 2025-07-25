import Header from "./header";
import Footer from "./footer";
let Notifications = () => {
    const notifications = [
  {
    id: 1,
    title: "New Circular from CSE Dept",
    message: "Meeting for 3rd year students on 20th July at 10 AM.",
    time: "2 hrs ago",
  },
  {
    id: 2,
    title: "Assignment Uploaded",
    message: "Data Structures assignment added by Dr. Anil Kumar.",
    time: "1 day ago",
  },
  {
    id: 3,
    title: "Workshop Reminder",
    message: "AI & ML workshop begins tomorrow at 9 AM in Seminar Hall.",
    time: "3 days ago",
  },
];

return<>
<Header></Header>
<div className="notifications-container">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p className="empty">No new notifications</p>
      ) : (
        notifications.map((note) => (
          <div className="notification-card" key={note.id}>
            <div className="note-content">
              <h4>{note.title}</h4>
              <p>{note.message}</p>
              <span className="note-time">{note.time}</span>
            </div>
          </div>
        ))
      )}
    </div>
<Footer></Footer>
</>
}
export default Notifications;