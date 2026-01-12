// Initialize jsPDF
const { jsPDF } = window.jspdf;

// DOM Elements
const fullNameInput = document.getElementById('fullName');
const jobTitleInput = document.getElementById('jobTitle');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const locationInput = document.getElementById('location');
const summaryInput = document.getElementById('summary');
const skillsInput = document.getElementById('skills');

const experienceContainer = document.getElementById('experienceContainer');
const educationContainer = document.getElementById('educationContainer');
const addExperienceBtn = document.getElementById('addExperienceBtn');
const addEducationBtn = document.getElementById('addEducationBtn');

const updatePreviewBtn = document.getElementById('updatePreviewBtn');
const saveResumeBtn = document.getElementById('saveResumeBtn');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');
const resetBtn = document.getElementById('resetBtn');

const resumePreview = document.getElementById('resumePreview');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const loadingOverlay = document.getElementById('loadingOverlay');

// Data storage
let resumeData = {
    personalInfo: {
        name: "John Doe",
        title: "Senior Software Engineer",
        email: "john.doe@example.com",
        phone: "+1 (123) 456-7890",
        location: "New York, NY",
        summary: "Experienced software engineer with 8+ years in full-stack development. Specialized in JavaScript, React, Node.js, and cloud technologies. Proven track record of delivering scalable solutions."
    },
    experiences: [
        {
            id: 1,
            title: "Senior Software Engineer",
            company: "Tech Solutions Inc.",
            duration: "2019 - Present",
            description: "Led a team of 5 developers to build a customer management system using React and Node.js. Improved application performance by 40% through code optimization."
        }
    ],
    education: [
        {
            id: 1,
            degree: "Master of Computer Science",
            institution: "Stanford University",
            duration: "2016",
            description: "Specialized in Software Engineering and Machine Learning. Graduated with honors."
        }
    ],
    skills: ["JavaScript", "React", "Node.js", "Python", "AWS"]
};

// Initialize with saved data or defaults
function initializeData() {
    const savedData = localStorage.getItem('resumeBuilderData');
    if (savedData) {
        resumeData = JSON.parse(savedData);
        showToast('Resume data loaded from storage', 'success');
    }
    
    // Populate form fields
    populateFormFields();
    
    // Render dynamic sections
    renderExperiences();
    renderEducation();
    
    // Update preview
    updatePreview();
}

// Populate form fields from data
function populateFormFields() {
    fullNameInput.value = resumeData.personalInfo.name;
    jobTitleInput.value = resumeData.personalInfo.title;
    emailInput.value = resumeData.personalInfo.email;
    phoneInput.value = resumeData.personalInfo.phone;
    locationInput.value = resumeData.personalInfo.location;
    summaryInput.value = resumeData.personalInfo.summary;
    skillsInput.value = resumeData.skills.join(', ');
}

// Render experiences in form
function renderExperiences() {
    experienceContainer.innerHTML = '';
    
    resumeData.experiences.forEach((exp, index) => {
        const experienceItem = createExperienceElement(exp, index);
        experienceContainer.appendChild(experienceItem);
    });
    
    attachExperienceEventListeners();
}

// Create experience element
function createExperienceElement(exp, index) {
    const experienceItem = document.createElement('div');
    experienceItem.className = 'dynamic-item';
    experienceItem.innerHTML = `
        <div class="dynamic-item-header">
            <div class="dynamic-item-title">Experience #${index + 1}</div>
            <button class="remove-btn" data-id="${exp.id}">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="form-group">
            <label>Job Title</label>
            <input type="text" class="exp-title" value="${exp.title}" placeholder="Senior Software Engineer" data-id="${exp.id}">
        </div>
        <div class="form-group">
            <label>Company</label>
            <input type="text" class="exp-company" value="${exp.company}" placeholder="Tech Solutions Inc." data-id="${exp.id}">
        </div>
        <div class="form-group">
            <label>Duration</label>
            <input type="text" class="exp-duration" value="${exp.duration}" placeholder="2019 - Present" data-id="${exp.id}">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea class="exp-description small" placeholder="Describe your responsibilities and achievements..." data-id="${exp.id}">${exp.description}</textarea>
        </div>
    `;
    return experienceItem;
}

// Render education in form
function renderEducation() {
    educationContainer.innerHTML = '';
    
    resumeData.education.forEach((edu, index) => {
        const educationItem = createEducationElement(edu, index);
        educationContainer.appendChild(educationItem);
    });
    
    attachEducationEventListeners();
}

// Create education element
function createEducationElement(edu, index) {
    const educationItem = document.createElement('div');
    educationItem.className = 'dynamic-item';
    educationItem.innerHTML = `
        <div class="dynamic-item-header">
            <div class="dynamic-item-title">Education #${index + 1}</div>
            <button class="remove-btn" data-id="${edu.id}">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="form-group">
            <label>Degree / Qualification</label>
            <input type="text" class="edu-degree" value="${edu.degree}" placeholder="Master of Computer Science" data-id="${edu.id}">
        </div>
        <div class="form-group">
            <label>Institution</label>
            <input type="text" class="edu-institution" value="${edu.institution}" placeholder="Stanford University" data-id="${edu.id}">
        </div>
        <div class="form-group">
            <label>Duration</label>
            <input type="text" class="edu-duration" value="${edu.duration}" placeholder="2016" data-id="${edu.id}">
        </div>
        <div class="form-group">
            <label>Description (Optional)</label>
            <textarea class="edu-description small" placeholder="Any additional details..." data-id="${edu.id}">${edu.description}</textarea>
        </div>
    `;
    return educationItem;
}

// Attach event listeners to experience inputs
function attachExperienceEventListeners() {
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            removeExperience(id);
        });
    });
    
    document.querySelectorAll('.exp-title, .exp-company, .exp-duration, .exp-description').forEach(input => {
        input.addEventListener('input', function() {
            const id = parseInt(this.getAttribute('data-id'));
            updateExperienceField(id, this.className, this.value);
        });
    });
}

// Attach event listeners to education inputs
function attachEducationEventListeners() {
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            removeEducation(id);
        });
    });
    
    document.querySelectorAll('.edu-degree, .edu-institution, .edu-duration, .edu-description').forEach(input => {
        input.addEventListener('input', function() {
            const id = parseInt(this.getAttribute('data-id'));
            updateEducationField(id, this.className, this.value);
        });
    });
}

// Add new experience
function addExperience() {
    const newId = resumeData.experiences.length > 0 
        ? Math.max(...resumeData.experiences.map(e => e.id)) + 1 
        : 1;
        
    resumeData.experiences.push({
        id: newId,
        title: "",
        company: "",
        duration: "",
        description: ""
    });
    
    renderExperiences();
    showToast('Experience added', 'success');
}

// Add new education
function addEducation() {
    const newId = resumeData.education.length > 0 
        ? Math.max(...resumeData.education.map(e => e.id)) + 1 
        : 1;
        
    resumeData.education.push({
        id: newId,
        degree: "",
        institution: "",
        duration: "",
        description: ""
    });
    
    renderEducation();
    showToast('Education added', 'success');
}

// Remove experience
function removeExperience(id) {
    resumeData.experiences = resumeData.experiences.filter(exp => exp.id !== id);
    renderExperiences();
    updatePreview();
    showToast('Experience removed', 'warning');
}

// Remove education
function removeEducation(id) {
    resumeData.education = resumeData.education.filter(edu => edu.id !== id);
    renderEducation();
    updatePreview();
    showToast('Education removed', 'warning');
}

// Update experience field
function updateExperienceField(id, fieldClass, value) {
    const experience = resumeData.experiences.find(exp => exp.id === id);
    if (!experience) return;
    
    const field = fieldClass.replace('exp-', '');
    experience[field] = value;
    
    // Update preview in real-time
    updatePreview();
}

// Update education field
function updateEducationField(id, fieldClass, value) {
    const education = resumeData.education.find(edu => edu.id === id);
    if (!education) return;
    
    const field = fieldClass.replace('edu-', '');
    education[field] = value;
    
    // Update preview in real-time
    updatePreview();
}

// Update preview based on form data
function updatePreview() {
    // Update personal info
    document.getElementById('previewName').textContent = resumeData.personalInfo.name || '';
    document.getElementById('previewTitle').textContent = resumeData.personalInfo.title || '';
    document.getElementById('previewEmail').textContent = resumeData.personalInfo.email || '';
    document.getElementById('previewPhone').textContent = resumeData.personalInfo.phone || '';
    document.getElementById('previewLocation').textContent = resumeData.personalInfo.location || '';
    document.getElementById('previewSummary').textContent = resumeData.personalInfo.summary || '';
    
    // Update experiences
    updateExperiencePreview();
    
    // Update education
    updateEducationPreview();
    
    // Update skills
    updateSkillsPreview();
}

// Update experience preview
function updateExperiencePreview() {
    const previewExperience = document.getElementById('previewExperience');
    previewExperience.innerHTML = '';
    
    resumeData.experiences.forEach(exp => {
        if (!exp.title && !exp.company) return;
        
        const experienceItem = document.createElement('div');
        experienceItem.className = 'experience-item';
        experienceItem.innerHTML = `
            <div class="item-header">
                <div>
                    <div class="item-title">${exp.title || ''}</div>
                    <div class="item-subtitle">${exp.company || ''}</div>
                </div>
                <div class="item-duration">${exp.duration || ''}</div>
            </div>
            <div class="item-description">
                <p>${exp.description || ''}</p>
            </div>
        `;
        previewExperience.appendChild(experienceItem);
    });
}

// Update education preview
function updateEducationPreview() {
    const previewEducation = document.getElementById('previewEducation');
    previewEducation.innerHTML = '';
    
    resumeData.education.forEach(edu => {
        if (!edu.degree && !edu.institution) return;
        
        const educationItem = document.createElement('div');
        educationItem.className = 'education-item';
        educationItem.innerHTML = `
            <div class="item-header">
                <div>
                    <div class="item-title">${edu.degree || ''}</div>
                    <div class="item-subtitle">${edu.institution || ''}</div>
                </div>
                <div class="item-duration">${edu.duration || ''}</div>
            </div>
            <div class="item-description">
                <p>${edu.description || ''}</p>
            </div>
        `;
        previewEducation.appendChild(educationItem);
    });
}

// Update skills preview
function updateSkillsPreview() {
    const previewSkills = document.getElementById('previewSkills');
    previewSkills.innerHTML = '';
    
    resumeData.skills.forEach(skill => {
        if (!skill.trim()) return;
        
        const skillTag = document.createElement('span');
        skillTag.className = 'skill-tag';
        skillTag.textContent = skill.trim();
        previewSkills.appendChild(skillTag);
    });
}

// Save resume data to localStorage
function saveResumeData() {
    // Update resumeData from form inputs
    resumeData.personalInfo.name = fullNameInput.value;
    resumeData.personalInfo.title = jobTitleInput.value;
    resumeData.personalInfo.email = emailInput.value;
    resumeData.personalInfo.phone = phoneInput.value;
    resumeData.personalInfo.location = locationInput.value;
    resumeData.personalInfo.summary = summaryInput.value;
    
    // Update skills
    const skillsArray = skillsInput.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    resumeData.skills = skillsArray;
    
    // Save to localStorage
    localStorage.setItem('resumeBuilderData', JSON.stringify(resumeData));
    
    showToast('Resume saved successfully!', 'success');
}

// Download resume as PDF
async function downloadResumePDF() {
    loadingOverlay.style.display = 'flex';
    
    try {
        // Update resume data before generating PDF
        saveResumeData();
        
        // Use html2canvas to capture the resume preview
        const canvas = await html2canvas(resumePreview, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 190;
        const pageHeight = 297;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 10;
        
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // Add additional pages if needed
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight + 10;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        // Download the PDF
        const fileName = resumeData.personalInfo.name 
            ? `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`
            : 'Resume.pdf';
        pdf.save(fileName);
        
        showToast('PDF downloaded successfully!', 'success');
    } catch (error) {
        console.error('Error generating PDF:', error);
        showToast('Error generating PDF. Please try again.', 'error');
    } finally {
        loadingOverlay.style.display = 'none';
    }
}

// Reset form to default
function resetForm() {
    if (confirm('Are you sure you want to reset the form? All unsaved changes will be lost.')) {
        resumeData = {
            personalInfo: {
                name: "",
                title: "",
                email: "",
                phone: "",
                location: "",
                summary: ""
            },
            experiences: [],
            education: [],
            skills: []
        };
        
        localStorage.removeItem('resumeBuilderData');
        populateFormFields();
        renderExperiences();
        renderEducation();
        updatePreview();
        
        showToast('Form reset to default', 'warning');
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = 'toast';
    
    // Add type class
    if (type === 'error') {
        toast.classList.add('error');
    } else if (type === 'warning') {
        toast.classList.add('warning');
    }
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Attach event listeners to form inputs
function attachFormInputListeners() {
    const formInputs = [fullNameInput, jobTitleInput, emailInput, phoneInput, locationInput, summaryInput, skillsInput];
    
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Update data
            if (this.id === 'skills') {
                const skillsArray = this.value.split(',').map(skill => skill.trim()).filter(skill => skill);
                resumeData.skills = skillsArray;
            } else {
                const field = this.id;
                resumeData.personalInfo[field] = this.value;
            }
            
            // Update preview in real-time
            updatePreview();
        });
    });
}

// Initialize the application
function init() {
    // Attach event listeners
    addExperienceBtn.addEventListener('click', addExperience);
    addEducationBtn.addEventListener('click', addEducation);
    updatePreviewBtn.addEventListener('click', () => {
        saveResumeData();
        updatePreview();
    });
    saveResumeBtn.addEventListener('click', saveResumeData);
    downloadPdfBtn.addEventListener('click', downloadResumePDF);
    resetBtn.addEventListener('click', resetForm);
    
    // Attach form input listeners
    attachFormInputListeners();
    
    // Initialize data
    initializeData();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);