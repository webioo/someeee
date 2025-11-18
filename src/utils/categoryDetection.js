// AI-powered category detection based on complaint text
export const detectCategory = (issueText) => {
  const text = issueText.toLowerCase();

  // Medical Emergency - CRITICAL priority
  if (text.match(/ambulance|medical|emergency|doctor|hospital|patient|injury|accident|दवा|अस्पताल|एम्बुलेंस|मरीज/)) {
    return {
      category: 'medical',
      priority: 'critical',
      dept: 'Medical Dept',
      confidence: 'high'
    };
  }

  // Electricity - MEDIUM/HIGH priority
  if (text.match(/light|electricity|power|current|transformer|wire|बिजली|करंट|ट्रांसफॉर्मर|तार/)) {
    const isUrgent = text.match(/not working|no power|dark|broken|नहीं काम|बंद/);
    return {
      category: 'electricity',
      priority: isUrgent ? 'high' : 'medium',
      dept: 'Electricity Dept',
      confidence: 'high'
    };
  }

  // Water - HIGH priority
  if (text.match(/water|pipe|leak|tap|supply|drainage|sewer|पानी|नल|पाइप|सीवर/)) {
    const isLeaking = text.match(/leak|burst|overflow|टूट|बह/);
    return {
      category: 'water',
      priority: isLeaking ? 'high' : 'medium',
      dept: 'Water Supply Dept',
      confidence: 'high'
    };
  }

  // Road - MEDIUM/HIGH priority
  if (text.match(/road|pothole|street|highway|path|सड़क|रास्ता|गड्ढा/)) {
    const isDangerous = text.match(/accident|broken|big|dangerous|खतरनाक|बड़ा/);
    return {
      category: 'road',
      priority: isDangerous ? 'high' : 'medium',
      dept: 'Road Maintenance Dept',
      confidence: 'high'
    };
  }

  // Garbage - MEDIUM priority
  if (text.match(/garbage|waste|trash|dirty|smell|कचरा|गंदगी|सफाई/)) {
    return {
      category: 'garbage',
      priority: 'medium',
      dept: 'Garbage Collection Dept',
      confidence: 'high'
    };
  }

  // Safety/Security - HIGH priority
  if (text.match(/theft|crime|police|security|safety|चोरी|अपराध|सुरक्षा/)) {
    return {
      category: 'safety',
      priority: 'high',
      dept: 'Safety/Security Dept',
      confidence: 'medium'
    };
  }

  // Infrastructure - MEDIUM priority (default)
  return {
    category: 'infrastructure',
    priority: 'medium',
    dept: 'Infrastructure Dept',
    confidence: 'low'
  };
};

// Get department icon
export const getDepartmentIcon = (category) => {
  const icons = {
    electricity: '⚡',
    water: '💧',
    medical: '🚑',
    infrastructure: '🏗',
    garbage: '🗑',
    road: '🛣',
    safety: '👮'
  };
  return icons[category] || '📋';
};

// Get priority color
export const getPriorityColor = (priority) => {
  const colors = {
    critical: 'bg-red-600',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500'
  };
  return colors[priority] || 'bg-gray-500';
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-500',
    'in-progress': 'bg-blue-500',
    resolved: 'bg-green-600'
  };
  return colors[status] || 'bg-gray-500';
};
