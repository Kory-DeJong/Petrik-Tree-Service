// Modal Functions
function openModal(type) {
  document.getElementById("modal-" + type).style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeModal(type) {
  document.getElementById("modal-" + type).style.display = "none";
  document.body.style.overflow = "auto";
}

// Close modal when clicking outside
window.onclick = function(event) {
  if (event.target.classList.contains("modal")) {
      event.target.style.display = "none";
      document.body.style.overflow = "auto";
  }
};

// Store uploaded files
let uploadedFiles = new Set();

// Image upload handler
function handleFileSelect(event) {
  const files = event.target.files;
  const previewContainer = document.getElementById('imagePreviewContainer');
  
  // Process each file
  Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      
      // Check if file is already uploaded
      if (Array.from(uploadedFiles).some(f => f.name === file.name && f.size === file.size)) {
          return;
      }

      uploadedFiles.add(file);
      createImagePreview(file, previewContainer);
  });
}

// Create image preview
function createImagePreview(file, container) {
  const reader = new FileReader();
  const previewDiv = document.createElement('div');
  previewDiv.className = 'image-preview';

  // Create remove button
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-image';
  removeBtn.innerHTML = '×';
  removeBtn.onclick = function() {
      uploadedFiles.delete(file);
      previewDiv.remove();
  };

  reader.onload = function(e) {
      const img = document.createElement('img');
      img.src = e.target.result;
      previewDiv.appendChild(img);
      previewDiv.appendChild(removeBtn);
  };

  reader.readAsDataURL(file);
  container.appendChild(previewDiv);
}

// Form submission handler
function handleSubmit(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  
  // Add all uploaded files to FormData
  uploadedFiles.forEach(file => {
      formData.append('images[]', file);
  });
  
  // Log form data (for development purposes)
  console.log('Form submission:');
  for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
  }

  // Show success message
  alert("Thank you for your inquiry. We will contact you soon!");
  
  // Clear the image preview and uploaded files
  document.getElementById('imagePreviewContainer').innerHTML = '';
  uploadedFiles.clear();
  
  // Reset the form
  event.target.reset();
  
  return false;
}

// Drag and drop functionality
function initializeDragAndDrop() {
  const uploadBox = document.querySelector('.upload-box');
  const fileInput = document.getElementById('jobPhotos');
  
  function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
  }

  function highlight() {
      uploadBox.classList.add('highlight');
  }

  function unhighlight() {
      uploadBox.classList.remove('highlight');
  }

  function handleDrop(e) {
      unhighlight();
      preventDefaults(e);

      const dt = e.dataTransfer;
      const files = dt.files;
      
      // Create a new FileList-like object
      const dataTransfer = new DataTransfer();
      
      // Add dropped files to existing files
      Array.from(files).forEach(file => {
          if (file.type.startsWith('image/')) {
              dataTransfer.items.add(file);
          }
      });

      // Update the file input
      fileInput.files = dataTransfer.files;
      
      // Handle the new files
      handleFileSelect({ target: { files: dataTransfer.files } });
  }

  // Event listeners for drag and drop
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      uploadBox.addEventListener(eventName, preventDefaults, false);
      document.body.addEventListener(eventName, preventDefaults, false);
  });

  ['dragenter', 'dragover'].forEach(eventName => {
      uploadBox.addEventListener(eventName, highlight, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
      uploadBox.addEventListener(eventName, unhighlight, false);
  });

  uploadBox.addEventListener('drop', handleDrop, false);

  // Click to upload
  uploadBox.addEventListener('click', () => {
      fileInput.click();
  });
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
  initializeDragAndDrop();
  
  // Add change event listener to file input
  const fileInput = document.getElementById('jobPhotos');
  fileInput.addEventListener('change', handleFileSelect);
});
