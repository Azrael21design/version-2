// User Portal JavaScript

// Logout function
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    showToast('info', 'Logging out...');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }
}

// Menu item click handlers
const menuItems = document.querySelectorAll('.menu-item');

menuItems.forEach(item => {
  item.addEventListener('click', function() {
    const page = this.getAttribute('data-page');
    handleMenuClick(page);
  });

  // Add hover sound effect (optional)
  item.addEventListener('mouseenter', function() {
    this.style.cursor = 'pointer';
  });
});

// Handle menu clicks
function handleMenuClick(page) {
  switch(page) {
    case 'apply':
      openApplyModal();
      break;
      
    case 'track':
      openTrackModal();
      break;
      
    case 'history':
      openHistoryModal();
      break;
      
    case 'profile':
      openProfileModal();
      break;
      
    default:
      showToast('error', 'Page not found!');
  }
  
  // Add loading animation
  const clickedItem = document.querySelector(`[data-page="${page}"]`);
  if (clickedItem && page !== 'profile' && page !== 'track' && page !== 'history') {
    clickedItem.classList.add('loading');
    setTimeout(() => {
      clickedItem.classList.remove('loading');
    }, 1500);
  }
}

// Profile Management Functions
function openProfileModal() {
  // Check if profile already exists
  const profileData = localStorage.getItem('userProfile');
  
  if (profileData) {
    // Profile exists, show view
    showProfileView(JSON.parse(profileData));
  } else {
    // No profile, show form
    document.getElementById('profileModal').classList.add('show');
  }
}

function closeProfileModal() {
  document.getElementById('profileModal').classList.remove('show');
  // Reset form
  document.getElementById('profileForm').reset();
  resetPhotoPreview();
}

function closeProfileView() {
  document.getElementById('profileViewModal').classList.remove('show');
}

// Photo Upload Preview
const photoInput = document.getElementById('photoInput');
let uploadedPhotoData = null;

if (photoInput) {
  photoInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        uploadedPhotoData = event.target.result;
        const preview = document.getElementById('photoPreview');
        preview.innerHTML = `<img src="${event.target.result}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;">`;
      };
      reader.readAsDataURL(file);
    }
  });
}

function resetPhotoPreview() {
  const preview = document.getElementById('photoPreview');
  preview.innerHTML = `
    <i class="fas fa-user fa-3x"></i>
    <p>Click to upload photo</p>
  `;
  uploadedPhotoData = null;
}

// Generate Account ID
function generateAccountID() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const year = String(today.getFullYear()).slice(-2);
  const datePrefix = month + day + year; // mmddyy
  
  // Get random 3-digit series
  const randomSeries = String(Math.floor(Math.random() * 900) + 100);
  
  return datePrefix + randomSeries;
}

// Handle Profile Form Submission
const profileForm = document.getElementById('profileForm');
if (profileForm) {
  profileForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate photo upload
    if (!uploadedPhotoData) {
      showToast('error', 'Please upload your 2x2 photo!');
      return;
    }
    
    // Collect form data
    const formData = {
      accountID: generateAccountID(),
      lastName: document.getElementById('lastName').value.trim(),
      firstName: document.getElementById('firstName').value.trim(),
      middleName: document.getElementById('middleName').value.trim(),
      address: document.getElementById('address').value.trim(),
      birthdate: document.getElementById('birthdate').value,
      gender: document.getElementById('gender').value,
      citizenship: document.getElementById('citizenship').value,
      mobile: document.getElementById('mobile').value.trim(),
      email: document.getElementById('email').value.trim(),
      photo: uploadedPhotoData,
      submittedDate: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(formData));
    
    // Show success message
    showToast('success', 'Profile submitted successfully!');
    
    // Close form modal
    closeProfileModal();
    
    // Show profile view after short delay
    setTimeout(() => {
      showProfileView(formData);
    }, 500);
  });
}

// Show Profile View
function showProfileView(profileData) {
  // Populate data
  document.getElementById('displayAccountID').textContent = profileData.accountID;
  document.getElementById('displayFullName').textContent = 
    `${profileData.firstName} ${profileData.middleName} ${profileData.lastName}`.replace(/\s+/g, ' ').trim();
  document.getElementById('displayAddress').textContent = profileData.address;
  document.getElementById('displayBirthdate').textContent = formatDate(profileData.birthdate);
  document.getElementById('displayGender').textContent = profileData.gender;
  document.getElementById('displayCitizenship').textContent = profileData.citizenship;
  document.getElementById('displayMobile').textContent = profileData.mobile;
  document.getElementById('displayEmail').textContent = profileData.email;
  document.getElementById('displayPhoto').src = profileData.photo;
  
  // Show modal
  document.getElementById('profileViewModal').classList.add('show');
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Request Edit
function requestEdit() {
  const profileData = JSON.parse(localStorage.getItem('userProfile'));
  
  if (confirm('Submit an edit request to the administrator?\n\nYour current profile:\n' +
    `Name: ${profileData.firstName} ${profileData.lastName}\n` +
    `Account ID: ${profileData.accountID}`)) {
    
    showToast('success', 'Edit request submitted to administrator!');
    
    // In production, this would send a request to the backend
    console.log('Edit request submitted for:', profileData.accountID);
  }
}

// Apply Form Functions
let uploadedDocuments = {
  nbi: null,
  cedula: null,
  health: null
};

function openApplyModal() {
  // Check if user has a profile
  const profileData = localStorage.getItem('userProfile');
  
  if (!profileData) {
    // No profile, prompt user to complete profile first
    if (confirm('You need to complete your profile first before applying.\n\nGo to My Profile now?')) {
      openProfileModal();
    }
    return;
  }
  
  // Has profile, populate apply form
  const profile = JSON.parse(profileData);
  populateApplyForm(profile);
  
  // Show apply modal
  document.getElementById('applyModal').classList.add('show');
}

function closeApplyModal() {
  document.getElementById('applyModal').classList.remove('show');
  // Reset form
  document.getElementById('applyForm').reset();
  resetDocumentUploads();
}

function populateApplyForm(profile) {
  // Set photo
  document.getElementById('applyPhoto').src = profile.photo;
  
  // Set Account ID
  document.getElementById('applyAccountID').textContent = profile.accountID;
  
  // Set all profile details
  document.getElementById('applyFullName').textContent = 
    `${profile.firstName} ${profile.middleName} ${profile.lastName}`.replace(/\s+/g, ' ').trim();
  document.getElementById('applyAddress').textContent = profile.address;
  document.getElementById('applyBirthdate').textContent = formatDate(profile.birthdate);
  document.getElementById('applyGender').textContent = profile.gender;
  document.getElementById('applyCitizenship').textContent = profile.citizenship;
  document.getElementById('applyMobile').textContent = profile.mobile;
  document.getElementById('applyEmail').textContent = profile.email;
}

// Document Upload Handlers
const nbiInput = document.getElementById('nbiInput');
const cedulaInput = document.getElementById('cedulaInput');
const healthInput = document.getElementById('healthInput');

if (nbiInput) {
  nbiInput.addEventListener('change', function(e) {
    handleDocumentUpload(e, 'nbi');
  });
}

if (cedulaInput) {
  cedulaInput.addEventListener('change', function(e) {
    handleDocumentUpload(e, 'cedula');
  });
}

if (healthInput) {
  healthInput.addEventListener('change', function(e) {
    handleDocumentUpload(e, 'health');
  });
}

function handleDocumentUpload(event, docType) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Check file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    showToast('error', 'File size must be less than 5MB!');
    event.target.value = '';
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const fileData = e.target.result;
    uploadedDocuments[docType] = {
      name: file.name,
      type: file.type,
      data: fileData
    };
    
    // Update preview
    updateDocumentPreview(docType, file);
    
    // Update file name display
    const fileNameElement = document.getElementById(`${docType}FileName`);
    fileNameElement.textContent = file.name;
    fileNameElement.classList.add('uploaded');
    
    showToast('success', `${getDocumentLabel(docType)} uploaded!`);
  };
  
  reader.readAsDataURL(file);
}

function updateDocumentPreview(docType, file) {
  const preview = document.getElementById(`${docType}Preview`);
  preview.classList.add('has-file');
  
  if (file.type.startsWith('image/')) {
    // Show image preview
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.innerHTML = `<img src="${e.target.result}" alt="${file.name}">`;
    };
    reader.readAsDataURL(file);
  } else {
    // Show PDF icon with checkmark
    preview.innerHTML = `
      <i class="fas fa-file-pdf fa-2x" style="color: #48bb78;"></i>
      <p style="color: #48bb78; font-weight: 600;">✓ Uploaded</p>
    `;
  }
}

function getDocumentLabel(docType) {
  const labels = {
    nbi: 'NBI Clearance',
    cedula: 'Cedula',
    health: 'Health Certificate'
  };
  return labels[docType] || docType;
}

function resetDocumentUploads() {
  uploadedDocuments = {
    nbi: null,
    cedula: null,
    health: null
  };
  
  // Reset previews
  ['nbi', 'cedula', 'health'].forEach(docType => {
    const preview = document.getElementById(`${docType}Preview`);
    preview.classList.remove('has-file');
    preview.innerHTML = `
      <i class="fas fa-file-pdf fa-2x"></i>
      <p>Click to upload</p>
    `;
    
    const fileName = document.getElementById(`${docType}FileName`);
    fileName.textContent = '';
    fileName.classList.remove('uploaded');
  });
}

// Handle Apply Form Submission
const applyForm = document.getElementById('applyForm');
if (applyForm) {
  applyForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate all documents are uploaded
    if (!uploadedDocuments.nbi || !uploadedDocuments.cedula || !uploadedDocuments.health) {
      showToast('error', 'Please upload all required documents!');
      return;
    }
    
    // Get profile data
    const profile = JSON.parse(localStorage.getItem('userProfile'));
    
    // Collect application data
    const applicationData = {
      applicationID: generateApplicationID(),
      accountID: profile.accountID,
      // Profile data
      fullName: `${profile.firstName} ${profile.middleName} ${profile.lastName}`.replace(/\s+/g, ' ').trim(),
      address: profile.address,
      birthdate: profile.birthdate,
      gender: profile.gender,
      citizenship: profile.citizenship,
      mobile: profile.mobile,
      email: profile.email,
      photo: profile.photo,
      // Application data
      purpose: document.getElementById('applyPurpose').value,
      occupation: document.getElementById('applyOccupation').value,
      // Documents
      documents: {
        nbi: uploadedDocuments.nbi,
        cedula: uploadedDocuments.cedula,
        health: uploadedDocuments.health
      },
      // Metadata
      status: 'Pending',
      submittedDate: new Date().toISOString()
    };
    
    // Save application
    saveApplication(applicationData);
    
    // Show success message
    showToast('success', 'Application submitted successfully!');
    
    // Close modal
    closeApplyModal();
    
    // Show confirmation with application ID
    setTimeout(() => {
      alert(`Application Submitted!\n\nApplication ID: ${applicationData.applicationID}\nStatus: Pending\n\nYou will receive updates via email and SMS.`);
    }, 500);
  });
}

function generateApplicationID() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  
  return `APP-${year}${month}${day}-${random}`;
}

function saveApplication(applicationData) {
  // Get existing applications
  let applications = localStorage.getItem('userApplications');
  applications = applications ? JSON.parse(applications) : [];
  
  // Add new application
  applications.push(applicationData);
  
  // Save back to localStorage
  localStorage.setItem('userApplications', JSON.stringify(applications));
  
  // In production, this would be an API call
  console.log('Application saved:', applicationData);
}

// Toast notification system
function showToast(type, message) {
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.className = `toast-notification ${type}`;
  
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    info: 'fa-info-circle'
  };
  
  const colors = {
    success: '#48bb78',
    error: '#f56565',
    info: '#4299e1'
  };
  
  toast.innerHTML = `
    <i class="fas ${icons[type]}"></i>
    <span>${message}</span>
  `;
  
  toast.style.cssText = `
    position: fixed;
    top: 30px;
    right: 30px;
    background: white;
    padding: 18px 24px;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    font-weight: 600;
    z-index: 10000;
    border-left: 4px solid ${colors[type]};
    transform: translateX(400px);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  `;
  
  const icon = toast.querySelector('i');
  icon.style.color = colors[type];
  icon.style.fontSize = '20px';
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
    toast.style.opacity = '1';
  }, 100);
  
  setTimeout(() => {
    toast.style.transform = 'translateX(400px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    logout();
  }
});

// Add entry animation
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});

// Prevent right-click (optional security)
// document.addEventListener('contextmenu', (e) => {
//   e.preventDefault();
// });

// Track Application Functions
function openTrackModal() {
  // Get applications
  const applications = getApplications();
  
  if (applications.length === 0) {
    // Show empty state
    document.getElementById('applicationsList').style.display = 'none';
    document.getElementById('emptyState').style.display = 'block';
  } else {
    // Show applications list
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('applicationsList').style.display = 'block';
    populateApplicationsList(applications);
  }
  
  document.getElementById('trackModal').classList.add('show');
}

function closeTrackModal() {
  document.getElementById('trackModal').classList.remove('show');
}

function getApplications() {
  const apps = localStorage.getItem('userApplications');
  return apps ? JSON.parse(apps) : [];
}

function populateApplicationsList(applications) {
  const container = document.getElementById('applicationsList');
  container.innerHTML = '';
  
  // Sort by date (newest first)
  applications.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate));
  
  applications.forEach(app => {
    const card = createApplicationCard(app);
    container.appendChild(card);
  });
}

function createApplicationCard(app) {
  const card = document.createElement('div');
  card.className = 'application-card';
  card.onclick = () => viewApplicationDetails(app);
  
  // Determine current step and status
  const step = app.currentStep || 1;
  const statusText = getStatusText(step);
  const statusClass = getStatusClass(step);
  const iconClass = getIconClass(step);
  
  const submitDate = new Date(app.submittedDate);
  const formattedDate = submitDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  card.innerHTML = `
    <div class="app-card-icon ${iconClass}">
      <i class="fas ${getIconType(step)}"></i>
    </div>
    <div class="app-card-info">
      <div class="app-card-id">${app.applicationID}</div>
      <div class="app-card-meta">
        <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
        <span><i class="fas fa-briefcase"></i> ${app.occupation}</span>
      </div>
    </div>
    <div class="app-card-status">
      <div class="status-badge-track ${statusClass}">${statusText}</div>
      <div class="view-details-btn">
        View Details <i class="fas fa-chevron-right"></i>
      </div>
    </div>
  `;
  
  return card;
}

function getStatusText(step) {
  const statuses = {
    1: 'Applied',
    2: 'Payment',
    3: 'Verification',
    4: 'Completed'
  };
  return statuses[step] || 'Applied';
}

function getStatusClass(step) {
  const classes = {
    1: 'applied',
    2: 'payment',
    3: 'verification',
    4: 'completed'
  };
  return classes[step] || 'applied';
}

function getIconClass(step) {
  const classes = {
    1: 'pending',
    2: 'payment',
    3: 'verification',
    4: 'completed'
  };
  return classes[step] || 'pending';
}

function getIconType(step) {
  const icons = {
    1: 'fa-file-alt',
    2: 'fa-credit-card',
    3: 'fa-check-circle',
    4: 'fa-flag-checkered'
  };
  return icons[step] || 'fa-file-alt';
}

// Application Details Modal
function viewApplicationDetails(app) {
  // Close track modal
  closeTrackModal();
  
  // Populate details
  const step = app.currentStep || 1;
  document.getElementById('detailAppID').textContent = app.applicationID;
  
  const submitDate = new Date(app.submittedDate);
  document.getElementById('detailSubmitDate').textContent = submitDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  document.getElementById('detailOccupation').textContent = app.occupation;
  
  // Update progress steps
  updateProgressSteps(step);
  
  // Update status message
  updateStatusMessage(step);
  
  // Update action button
  updateActionButton(step);
  
  // Show modal
  document.getElementById('appDetailsModal').classList.add('show');
}

function closeAppDetailsModal() {
  document.getElementById('appDetailsModal').classList.remove('show');
}

function updateProgressSteps(currentStep) {
  // Reset all steps
  for (let i = 1; i <= 4; i++) {
    const stepEl = document.getElementById(`step${i}`);
    stepEl.classList.remove('completed', 'active');
  }
  
  // Mark completed steps
  for (let i = 1; i < currentStep; i++) {
    document.getElementById(`step${i}`).classList.add('completed');
  }
  
  // Mark current step
  if (currentStep <= 4) {
    document.getElementById(`step${currentStep}`).classList.add('active');
  }
  
  // If completed all steps
  if (currentStep === 4) {
    document.getElementById('step4').classList.add('completed');
    document.getElementById('step4').classList.remove('active');
  }
}

function updateStatusMessage(step) {
  const messages = {
    1: 'Your application has been submitted and is awaiting payment.',
    2: 'Payment received. Your documents are being verified.',
    3: 'Verification in progress. We are reviewing your submitted documents.',
    4: 'Your application is complete! You can pick up your documents at the office.'
  };
  
  document.getElementById('statusMessage').textContent = messages[step] || messages[1];
}

function updateActionButton(step) {
  const actionBtn = document.getElementById('actionButton');
  
  if (step === 1) {
    actionBtn.style.display = 'flex';
    actionBtn.innerHTML = '<i class="fas fa-credit-card"></i> Make Payment';
    actionBtn.onclick = () => {
      showToast('info', 'Redirecting to payment page...');
      // In production, redirect to payment
    };
  } else if (step === 4) {
    actionBtn.style.display = 'flex';
    actionBtn.innerHTML = '<i class="fas fa-download"></i> Download Receipt';
    actionBtn.onclick = () => {
      showToast('success', 'Receipt downloaded!');
      // In production, download actual receipt
    };
  } else {
    actionBtn.style.display = 'none';
  }
}

// History Functions
let currentHistoryFilter = 'all';

function openHistoryModal() {
  currentHistoryFilter = 'all';
  loadHistory();
  document.getElementById('historyModal').classList.add('show');
}

function closeHistoryModal() {
  document.getElementById('historyModal').classList.remove('show');
}

function filterHistory(filter) {
  currentHistoryFilter = filter;
  
  // Update active tab
  document.querySelectorAll('.history-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  event.target.closest('.history-tab').classList.add('active');
  
  loadHistory();
}

function loadHistory() {
  const timeline = document.getElementById('activityTimeline');
  const emptyState = document.getElementById('historyEmptyState');
  
  // Get all activities
  const activities = getAllActivities();
  
  // Filter activities
  const filtered = filterActivities(activities, currentHistoryFilter);
  
  if (filtered.length === 0) {
    timeline.style.display = 'none';
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    timeline.style.display = 'block';
    populateTimeline(filtered);
  }
}

function getAllActivities() {
  const activities = [];
  
  // Get applications
  const applications = getApplications();
  applications.forEach(app => {
    activities.push({
      type: 'application',
      title: 'Application Submitted',
      description: `Submitted application ${app.applicationID} for ${app.occupation}`,
      date: new Date(app.submittedDate),
      meta: {
        id: app.applicationID,
        purpose: app.purpose
      }
    });
    
    // Add status changes if any
    if (app.currentStep >= 2) {
      activities.push({
        type: 'status',
        title: 'Payment Received',
        description: `Payment processed for application ${app.applicationID}`,
        date: new Date(app.submittedDate),
        meta: { id: app.applicationID }
      });
    }
    
    if (app.currentStep >= 3) {
      activities.push({
        type: 'status',
        title: 'Verification Started',
        description: `Document verification started for ${app.applicationID}`,
        date: new Date(app.submittedDate),
        meta: { id: app.applicationID }
      });
    }
    
    if (app.currentStep === 4) {
      activities.push({
        type: 'status',
        title: 'Application Completed',
        description: `Application ${app.applicationID} is ready for pickup`,
        date: new Date(app.submittedDate),
        meta: { id: app.applicationID }
      });
    }
  });
  
  // Add profile creation
  const profile = localStorage.getItem('userProfile');
  if (profile) {
    const profileData = JSON.parse(profile);
    activities.push({
      type: 'edit',
      title: 'Profile Created',
      description: `Created profile with Account ID ${profileData.accountID}`,
      date: new Date(profileData.submittedDate),
      meta: { accountId: profileData.accountID }
    });
  }
  
  // Add login activity (current session)
  activities.push({
    type: 'login',
    title: 'Logged In',
    description: 'Successfully logged into PASIG Tax Portal',
    date: new Date(),
    meta: { device: 'Web Browser' }
  });
  
  // Sort by date (newest first)
  activities.sort((a, b) => b.date - a.date);
  
  return activities;
}

function filterActivities(activities, filter) {
  if (filter === 'all') return activities;
  
  const filterMap = {
    'applications': ['application'],
    'edits': ['edit'],
    'logins': ['login']
  };
  
  const types = filterMap[filter] || [];
  return activities.filter(act => types.includes(act.type));
}

function populateTimeline(activities) {
  const timeline = document.getElementById('activityTimeline');
  timeline.innerHTML = '';
  
  activities.forEach((activity, index) => {
    const item = createActivityItem(activity, index);
    timeline.appendChild(item);
  });
}

function createActivityItem(activity, index) {
  const item = document.createElement('div');
  item.className = 'activity-item';
  item.style.animationDelay = `${index * 0.05}s`;
  
  const timeAgo = getTimeAgo(activity.date);
  
  item.innerHTML = `
    <div class="activity-dot ${activity.type}"></div>
    <div class="activity-card">
      <div class="activity-header">
        <div class="activity-title">
          <i class="fas ${getActivityIcon(activity.type)}"></i>
          ${activity.title}
        </div>
        <div class="activity-time">${timeAgo}</div>
      </div>
      <div class="activity-description">${activity.description}</div>
      ${activity.meta ? createActivityMeta(activity.meta) : ''}
    </div>
  `;
  
  return item;
}

function getActivityIcon(type) {
  const icons = {
    'application': 'fa-file-alt',
    'edit': 'fa-edit',
    'login': 'fa-sign-in-alt',
    'status': 'fa-info-circle'
  };
  return icons[type] || 'fa-circle';
}

function createActivityMeta(meta) {
  const items = [];
  
  if (meta.id) items.push(`<span><i class="fas fa-hashtag"></i> ${meta.id}</span>`);
  if (meta.purpose) items.push(`<span><i class="fas fa-tag"></i> ${meta.purpose}</span>`);
  if (meta.accountId) items.push(`<span><i class="fas fa-id-card"></i> ${meta.accountId}</span>`);
  if (meta.device) items.push(`<span><i class="fas fa-desktop"></i> ${meta.device}</span>`);
  
  if (items.length === 0) return '';
  
  return `<div class="activity-meta">${items.join('')}</div>`;
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  if (seconds < 60) return 'Just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  // Otherwise show formatted date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Console welcome message
console.log('%c🏛️ PASIG Tax Portal', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cUser Portal Loaded Successfully', 'color: #48bb78; font-size: 14px;');