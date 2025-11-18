// Auto-assign complaints to officers based on department and workload
export const assignToOfficer = (department, officers, complaints) => {
  // Find officers in the specified department
  const deptOfficers = officers.filter(o => o.department === department);

  if (deptOfficers.length === 0) {
    // No officers in this department - assign to first available officer
    return officers[0]?.id || null;
  }

  // Calculate active complaints for each officer
  const officerWorkload = deptOfficers.map(officer => {
    const activeCount = complaints.filter(
      c => c.assignedOfficer === officer.id && c.status !== 'resolved'
    ).length;

    return {
      ...officer,
      currentActiveComplaints: activeCount
    };
  });

  // Find officer with least workload (load balancing)
  const leastBusy = officerWorkload.reduce((min, officer) =>
    officer.currentActiveComplaints < min.currentActiveComplaints ? officer : min
  );

  return leastBusy.id;
};

// Update officer active complaint counts
export const updateOfficerCounts = (officers, complaints) => {
  return officers.map(officer => ({
    ...officer,
    activeComplaints: complaints.filter(
      c => c.assignedOfficer === officer.id && c.status !== 'resolved'
    ).length
  }));
};

// Get department label from value
export const getDepartmentLabel = (category, departments) => {
  const dept = departments.find(d => d.value === category);
  return dept ? dept.label : 'Unknown Department';
};
