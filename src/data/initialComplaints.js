export const initialComplaints = [
  {
    id: 1,
    title: "Street light not working near temple",
    category: "electricity",
    status: "in-progress",
    user: "Ramesh Kumar",
    location: "Main Road, Arvi",
    timestamp: "2025-11-17 10:30",
    priority: "medium",
    assignedTo: "Electricity Dept",
    assignedOfficer: "officer1",
    synced: true,
    remarks: [
      {
        by: "officer1",
        byName: "Rajesh Patil",
        text: "Team has been dispatched to check the issue",
        timestamp: "2025-11-17 11:00",
        statusChange: "pending → in-progress"
      }
    ],
    categoryChangeRequest: null,
    photo: "captured"
  },
  {
    id: 2,
    title: "Water pipe leaking on Gandhi Road",
    category: "water",
    status: "resolved",
    user: "Sunita Patil",
    location: "Gandhi Road, Arvi",
    timestamp: "2025-11-16 09:15",
    priority: "high",
    assignedTo: "Water Supply Dept",
    assignedOfficer: "officer2",
    synced: true,
    remarks: [
      {
        by: "officer2",
        byName: "Priya Sharma",
        text: "Inspected the location, leak confirmed",
        timestamp: "2025-11-16 10:00",
        statusChange: "pending → in-progress"
      },
      {
        by: "officer2",
        byName: "Priya Sharma",
        text: "Pipe has been repaired successfully",
        timestamp: "2025-11-16 14:30",
        statusChange: "in-progress → resolved"
      }
    ],
    categoryChangeRequest: null,
    photo: "captured"
  },
  {
    id: 3,
    title: "Need ambulance urgently",
    category: "medical",
    status: "resolved",
    user: "Prakash Mehta",
    location: "Shivaji Nagar, Arvi",
    timestamp: "2025-11-17 08:00",
    priority: "critical",
    assignedTo: "Medical Dept",
    assignedOfficer: "officer3",
    synced: true,
    remarks: [
      {
        by: "officer3",
        byName: "Amit Kumar",
        text: "Ambulance dispatched immediately",
        timestamp: "2025-11-17 08:05",
        statusChange: "pending → in-progress"
      },
      {
        by: "officer3",
        byName: "Amit Kumar",
        text: "Patient reached hospital safely",
        timestamp: "2025-11-17 08:45",
        statusChange: "in-progress → resolved"
      }
    ],
    categoryChangeRequest: null,
    photo: "captured"
  },
  {
    id: 4,
    title: "Pothole on main highway",
    category: "road",
    status: "pending",
    user: "Mahesh Jadhav",
    location: "Highway Junction, Arvi",
    timestamp: "2025-11-18 07:30",
    priority: "high",
    assignedTo: "Road Maintenance Dept",
    assignedOfficer: "officer4",
    synced: true,
    remarks: [],
    categoryChangeRequest: null,
    photo: "captured"
  },
  {
    id: 5,
    title: "Garbage not collected for 3 days",
    category: "garbage",
    status: "pending",
    user: "Kavita Singh",
    location: "Nehru Colony, Arvi",
    timestamp: "2025-11-18 09:00",
    priority: "medium",
    assignedTo: "Garbage Collection Dept",
    assignedOfficer: "officer5",
    synced: true,
    remarks: [],
    categoryChangeRequest: null,
    photo: "captured"
  },
  {
    id: 6,
    title: "Power transformer making noise",
    category: "electricity",
    status: "pending",
    user: "Suresh Wagh",
    location: "Market Area, Arvi",
    timestamp: "2025-11-18 11:00",
    priority: "high",
    assignedTo: "Electricity Dept",
    assignedOfficer: "officer1",
    synced: true,
    remarks: [],
    categoryChangeRequest: null,
    photo: "captured"
  }
];
