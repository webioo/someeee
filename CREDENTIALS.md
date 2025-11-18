# 🔐 Unified Civic Voice Platform - Login Credentials

## Super Admin Dashboard

**Access Level**: Full system control
- **Username**: `superadmin`
- **Password**: `admin@2025`

**Capabilities**:
- View all complaints across departments
- Create new officers
- Approve/reject category change requests
- Monitor system-wide statistics
- Manage all departments

---

## Officer Portal Logins

All officers use the same password: `pass123`

### 1. Electricity Department
- **Username**: `raj.patil`
- **Officer Name**: Rajesh Patil
- **Department**: Electricity Dept ⚡

### 2. Water Supply Department
- **Username**: `priya.sharma`
- **Officer Name**: Priya Sharma
- **Department**: Water Supply Dept 💧

### 3. Medical Department
- **Username**: `amit.kumar`
- **Officer Name**: Amit Kumar
- **Department**: Medical Dept 🚑

### 4. Road Maintenance Department
- **Username**: `sunita.d`
- **Officer Name**: Sunita Deshmukh
- **Department**: Road Maintenance Dept 🛣

### 5. Garbage Collection Department
- **Username**: `vikas.y`
- **Officer Name**: Vikas Yadav
- **Department**: Garbage Collection Dept 🗑

### 6. Infrastructure Department
- **Username**: `ramesh.k`
- **Officer Name**: Ramesh Kulkarni
- **Department**: Infrastructure Dept 🏗

### 7. Safety/Security Department
- **Username**: `deepak.s`
- **Officer Name**: Deepak Singh
- **Department**: Safety/Security Dept 👮

**Officer Capabilities**:
- View assigned complaints only
- Update complaint status (pending → in-progress → resolved)
- Add mandatory remarks when updating status
- Request category changes with reasons
- View complaint history and remarks

---

## Rural Kiosk Portal

**Access**: No login required (Voice-only interface)

**Purpose**: Public complaint submission via voice in Hindi

---

## Citizen Portal

**Access**: No login required (Public transparency)

**Purpose**: View and track all complaints publicly

---

## Quick Access Guide

1. **To manage the system**: Use Super Admin with `superadmin` / `admin@2025`
2. **To handle complaints**: Login as an officer with their respective username / `pass123`
3. **To submit complaints**: Use Rural Kiosk (no login)
4. **To track complaints**: Use Citizen Portal (no login)

---

## Security Notes

⚠️ **These are demo credentials for testing purposes only**

For production deployment:
- Change all default passwords
- Implement strong password policies
- Add two-factor authentication
- Use secure backend authentication
- Encrypt sensitive data
- Implement role-based access control (RBAC)
- Add session management and timeouts

---

## Testing the Auto-Assignment Feature

When you submit a complaint via Rural Kiosk:

1. Speak your complaint in Hindi or English
2. The AI will detect the category based on keywords
3. The system will automatically assign it to the appropriate department
4. The complaint will be assigned to the officer with the least workload
5. You can check the console for assignment logs (in browser dev tools)

**Example**:
- Say "बिजली नहीं आ रही" (electricity not coming)
- System detects → Category: Electricity
- Auto-assigns to → Rajesh Patil (or least busy electricity officer)
- Officer can see it in their portal immediately

---

**Built with ❤️ for Rural India**
