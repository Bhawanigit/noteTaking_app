document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');

    // Define all necessary DOM elements
    const newNoteForm = document.getElementById('newNoteForm');
    const notesContainer = document.getElementById('notesContainer');
    const noteCategorySelect = document.getElementById('noteCategory');
    const addNoteBtn = document.getElementById('addNoteBtn');
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const categoryList = document.getElementById('categoryList');
    const newNoteModal = document.getElementById('newNoteModal');
    const newNoteBtn = document.getElementById('newNoteBtn');
    const closeModal = document.querySelector('.close');
    const deleteCategoryBtn = document.getElementById('deleteCategoryBtn');

    //edit note
    
    const editNoteButtons = document.querySelectorAll('.edit_note');
    const editNoteModal = document.getElementById('editNoteModal');
    const editNoteForm = document.getElementById('editNoteForm');
    const editNoteTitle = document.getElementById('editNoteTitle');
    const editNoteContent = document.getElementById('editNoteContent');
    const editNoteCategory = document.getElementById('editNoteCategory');
    const editNoteId = document.getElementById('editNoteId');
    const closeEditModalButton = document.querySelector('#editNoteModal .close');

    // Search box
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    console.log('newNoteForm:', newNoteForm);
    console.log('notesContainer:', notesContainer);
    console.log('noteCategorySelect:', noteCategorySelect);
    console.log('addNoteBtn:', addNoteBtn);
    console.log('addCategoryBtn:', addCategoryBtn);
    console.log('categoryList:', categoryList);
    console.log('newNoteModal:', newNoteModal);
    console.log('newNoteBtn:', newNoteBtn);
    console.log('closeModal:', closeModal);
    console.log('deleteCategoryBtn:', deleteCategoryBtn);

    const colors = ['#b2a48a', '#d1c8b8','#b7b9a3','#f3efe6', '#FFFFBA', '#FFDFBA', '#E0BBE4'];
    let colorIndex = document.querySelectorAll('.note-card').length % colors.length;

    if (newNoteForm) {
        newNoteForm.addEventListener('submit', handleNewNoteSubmission);
    } else {
        console.error('New note form not found');
    }

    if (addNoteBtn) {
        addNoteBtn.addEventListener('click', function () {
            newNoteModal.style.display = 'block';
        });
    } else {
        console.error('Add note button not found');
    }

    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', handleAddCategory);
    } else {
        console.error('Add category button not found');
    }

    if (newNoteBtn) {
        newNoteBtn.addEventListener('click', function () {
            newNoteModal.style.display = 'block';
        });
    } else {
        console.error('New note button not found');
    }

    if (closeModal) {
        closeModal.addEventListener('click', function () {
            newNoteModal.style.display = 'none';
        });
    } else {
        console.error('Close modal button not found');
    }

    window.addEventListener('click', function (event) {
        if (event.target === newNoteModal) {
            newNoteModal.style.display = 'none';
        }
    });

   

    function handleNewNoteSubmission(e) {
        e.preventDefault();
        console.log('New note submission triggered');
        const title = document.getElementById('noteTitle').value.trim();
        const content = document.getElementById('noteContent').value.trim();
        const category = noteCategorySelect.value;
        const color = colors[colorIndex];

        console.log('Title:', title);
        console.log('Content:', content);
        console.log('Category:', category);
        console.log('Color:', color);

        if (!title || !content || !category) {
            alert('Please fill in all fields');
            return;
        }

        const noteData = {
            title: title,
            content: content,
            category: category,
            color: color
        };

        fetch('add_note.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(noteData)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Response data:', data);
                if (data.success && data.note) {
                    const newNote = createNoteElement(data.note);
                    notesContainer.prepend(newNote);
                    newNoteForm.reset();
                    colorIndex = (colorIndex + 1) % colors.length;
                    newNoteModal.style.display = 'none';
                    updateCategoryFilters();
                } else {
                    throw new Error(data.message || 'Failed to add note');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert(error.message || 'Failed to add note. Please try again.');
            });
    }
    $(document).ready(function () {
        // Initialize the calendar
        $("#calendar").datepicker({
            onSelect: function (dateText, inst) {
                console.log('Date selected:', dateText);
                filterNotesByDate(dateText);
            }
        });
    
    // Function to filter notes by date
    function filterNotesByDate(selectedDate) {
        console.log('Filtering by date:', selectedDate);
        const noteCards = document.querySelectorAll('.note-card');
        console.log('Total note cards:', noteCards.length);
        let visibleCount = 0;

            // Convert selectedDate to YYYY-MM-DD format
            const formattedDate = $.datepicker.formatDate('yy-mm-dd', new Date(selectedDate));
            console.log('Formatted selected date:', formattedDate);

            noteCards.forEach(noteCard => {
                const noteDate = noteCard.getAttribute('data-created-at');
                console.log('Note date:', noteDate, 'Note ID:', noteCard.getAttribute('data-id'));

                if (!selectedDate || noteDate === formattedDate) {
                    noteCard.style.display = 'block';
                    visibleCount++;
                } else {
                    noteCard.style.display = 'none';
                }
            });

            console.log('Visible note cards:', visibleCount);
        }

        // Show all notes when the page loads
        filterNotesByDate();

        // Add event listener for "Show All Notes" button
        $('#showAllNotes').on('click', function () {
            console.log('Show All Notes clicked');
            filterNotesByDate();
        });
    });
    // temporary function
    function checkDataAttributes() {
        const noteCards = document.querySelectorAll('.note-card');
        console.log('Checking data attributes for', noteCards.length, 'note cards');
        noteCards.forEach(noteCard => {
            const id = noteCard.getAttribute('data-id');
            const createdAt = noteCard.getAttribute('data-created-at');
            console.log(`Note ID: ${id}, Created At: ${createdAt}`);
            if (!createdAt) {
                console.warn(`Note with ID ${id} is missing data-created-at attribute`);
            }
        });
    }

    // Call this function when the page loads
    $(document).ready(function () {
        checkDataAttributes();
        // ... rest of your code
    });


    function createNoteElement(note) {
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');
        noteCard.style.backgroundColor = note.color || '#ffffff'; // Default to white if no color;
        noteCard.setAttribute('data-id', note.id);
        noteCard.setAttribute('data-category', note.category);
        noteCard.setAttribute('data-category', note.category || 'Uncategorized');

        // Handle the created_at date
        if (note.created_at) {
            const dateOnly = note.created_at.split(' ')[0]; // Get date part
            noteCard.setAttribute('data-created-at', dateOnly);
        } else {
            noteCard.setAttribute('data-created-at', 'Unknown');
        }

        const title = document.createElement('h3');
        title.textContent = note.title || 'Untitled';

        const content = document.createElement('p');
        content.textContent = (note.content || '').substring(0, 100) + '...';

        const category = document.createElement('span');
        category.classList.add('category');
        category.textContent = note.category || 'Uncategorized';

        noteCard.appendChild(title);
        noteCard.appendChild(content);
        noteCard.appendChild(category);

        return noteCard;
    }

    let categories = []; // Array to store all categories

    //to add category

    function handleAddCategory() {
        console.log('Add Category button clicked');
        const newCategory = prompt("Enter a new category name:");
        if (newCategory !== null && newCategory.trim() !== '') {
            const trimmedCategory = newCategory.trim();
            if (categories.includes(trimmedCategory)) {
                alert('Category name already exists. Please enter a unique category name.');
            } else {
                saveCategories(trimmedCategory);
            }
        } else {
            console.error('Category name is required');
            alert('Category name cannot be empty.');
        }
    }

    // Function to update the category filters in the UI
    function updateCategoryFilters() {
        // Clear existing category links
        categoryList.innerHTML = ''; 
        noteCategorySelect.innerHTML = '<option value="" disabled selected>Select a category</option>'; // Clear existing options and add placeholder

        categories.forEach(category => {
            const listItem = document.createElement('li');
            //listItem.textContent = category;

            // Add category filter link
            const link = document.createElement('a');
            link.href = '#';
            link.classList.add('category-filter');
            link.setAttribute('data-category', category);
            link.textContent = category;

            listItem.appendChild(link);
            categoryList.appendChild(listItem);

            link.addEventListener('click', function (e) {
                e.preventDefault();
                const category = this.getAttribute('data-category');
                console.log('Filtering notes by category:', category);
                filterNotes(category);
            });

             // Create edit button
            const editBtn = document.createElement('button');
            editBtn.classList.add('edit-category-btn');
            editBtn.textContent = 'Edit';
            editBtn.setAttribute('data-category', category);
            editBtn.addEventListener('click', function (e) {
                e.preventDefault();
                editCategory(category);
            });

             // Create delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-category-btn');
            deleteBtn.innerHTML = '<img src="Trash.webp" alt="Delete" style="width: 18px; height: 18px; vertical-align: middle;">';
            deleteBtn.setAttribute('data-category', category);
            deleteBtn.addEventListener('click', function (e) {
                e.preventDefault();
                deleteCategory(category);
            });

          
            listItem.appendChild(editBtn);
            listItem.appendChild(deleteBtn);
            categoryList.appendChild(listItem);

            // Add category to the dropdown in the new note form
            const option = document.createElement('option');
            option.value = category;
            
            option.textContent = category;
            noteCategorySelect.appendChild(option);
        });
    }

    // Function to edit a category
    function editCategory(oldCategory) {
        // Prompt the user for the new category name
        const newCategory = prompt("Enter the new category name:", oldCategory);

        // Check if the user canceled the prompt or entered an empty name
        if (newCategory === null || newCategory.trim() === '') {
            alert('Category name cannot be empty.');
            return;
        }

        const trimmedCategory = newCategory.trim();

        // Check if the new category name already exists
        if (categories.includes(trimmedCategory)) {
            alert('Category name already exists. Please enter a unique category name.');
            return;
        }

        // Call the function to update the category in the database
        updateCategoryInDatabase(oldCategory, trimmedCategory);
    }

    function updateCategoryInDatabase(oldCategory, newCategory) {
        fetch('edit_category.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ oldCategory: oldCategory, newCategory: newCategory }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    console.log('Category updated successfully');
                    categories = categories.map(cat => cat === oldCategory ? newCategory : cat);
                    updateCategoryFilters();
                    updateNotesCategory(oldCategory, newCategory);
                } else {
                    throw new Error(data.message || 'Failed to update category');
                }
            })
            .catch(error => {
                console.error('Error updating category:', error);
                alert('Failed to update category. Please try again. Error: ' + error.message);
            });
    }

    function updateNotesCategory(oldCategory, newCategory) {
        const noteCards = document.querySelectorAll('.note-card');
        noteCards.forEach(noteCard => {
            if (noteCard.getAttribute('data-category') === oldCategory) {
                noteCard.setAttribute('data-category', newCategory);
                const categorySpan = noteCard.querySelector('.category');
                if (categorySpan) {
                    categorySpan.textContent = newCategory;
                }
            }
        });
    }

    // Function to delete a category
    function deleteCategory(category) {
        if (confirm(`Are you sure you want to delete the category "${category}"? This action cannot be undone.`)) {
            fetch('delete_category.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category: category }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        console.log('Category deleted successfully');
                        categories = categories.filter(cat => cat !== category); // Remove the deleted category from the list
                        updateCategoryFilters();
                    } else {
                        throw new Error(data.message || 'Failed to delete category');
                    }
                })
                .catch(error => {
                    console.error('Error deleting category:', error);
                    alert('Failed to delete category. Please try again. Error: ' + error.message);
                });
        }
    }

    // Load categories when the page loads
    function loadCategories() {
        fetch('get_categories.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    categories = data.categories;
                    updateCategoryFilters();
                } else {
                    console.error('Failed to load categories:', data.message);
                }
            })
            .catch(error => {
                console.error('Error loading categories:', error);
            });
    }

    // Call loadCategories when the page loads
    loadCategories();

    // Event listener for the "Add Category" button
    addCategoryBtn.addEventListener('click', handleAddCategory);

    // Function to handle adding a new category
    function handleAddCategory() {
        const newCategory = prompt("Enter a new category name:");
        if (newCategory !== null && newCategory.trim() !== '') {
            const trimmedCategory = newCategory.trim();
            if (categories.includes(trimmedCategory)) {
                alert('Category name already exists. Please enter a unique category name.');
            } else {
                saveCategories(trimmedCategory);
            }
        } else {
            alert('Category name cannot be empty.');
        }
    }

    function saveCategories(newCategory) {
        console.log('Saving categories:', newCategory);

        fetch('add_category.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category: newCategory }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text(); // Read response as text
            })
            .then(text => {
                console.log('Response text:', text); // Log the raw response
                return JSON.parse(text); // Attempt to parse JSON
            })
            .then(data => {
                if (data.success) {
                    console.log('Category saved successfully');
                    categories.push(newCategory); // Add new category to the array
                    updateCategoryFilters();
                } else {
                    throw new Error(data.message || 'Failed to save category');
                }
            })
            .catch(error => {
                console.error('Error saving category:', error);
                alert('Failed to save category. Please try again. Error: ' + error.message);
            });
    }

    function filterNotes(category) {
        const noteCards = document.querySelectorAll('.note-card');
        noteCards.forEach(noteCard => {
            const noteCategory = noteCard.getAttribute('data-category');
            if (category === 'all' || noteCategory === category) {
                noteCard.style.display = 'block';
            } else {
                noteCard.style.display = 'none';
            }
        });
    }

    // Initial call to update category filters
    updateCategoryFilters();

    // Close Edit Modal
    if (closeEditModalButton) {
        closeEditModalButton.addEventListener('click', function () {
            editNoteModal.style.display = 'none';
        });
    }

    window.addEventListener('click', function (event) {
        if (event.target === editNoteModal) {
            editNoteModal.style.display = 'none';
        }
    });
    // Handle Edit Note Submission
    if (editNoteForm) {
        editNoteForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const noteData = {
                id: editNoteId.value,
                title: editNoteTitle.value.trim(),
                content: editNoteContent.value.trim(),
                category: editNoteCategory.value
            };

            fetch('edit_note.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(noteData)
            })
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(text => { throw new Error(text); });
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        alert('Note edited successfully');
                        location.reload();
                    } else {
                        alert(data.message || 'Failed to edit note');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to edit note. Please try again. Error: ' + error.message);
                });
        });
    }

    

    // Event listeners for Edit Note button$(document).ready(function() {
    $(document).ready(function () {
        // Delete Note
        $(document).on('click', '.delete_note', function () {
            var noteId = $(this).closest('.note-card').data('id');

            if (confirm('Are you sure you want to delete this note?')) {
                $.ajax({
                    type: 'POST',
                    url: 'delete_note.php',
                    data: JSON.stringify({ id: noteId }),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function (response) {
                        if (response.success) {
                            alert('Note deleted successfully');
                            location.reload();
                        } else {
                            alert('Delete failed: ' + response.message);
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error('AJAX Error: ' + status + error);
                        console.log(xhr.responseText);
                    }
                });
            }
        });

        
        // Add click event listeners to edit buttons
        editNoteButtons.forEach(button => {
            button.addEventListener('click', function () {
                const noteId = this.getAttribute('data-id');
                openEditNoteModal(noteId);
            });
        });

        // Function to open edit note modal and populate it with note data
        function openEditNoteModal(noteId) {
            console.log('Fetching note with ID:', noteId);
            fetch(`get_note.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: noteId })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.note) {
                        const note = data.note;
                        editNoteTitle.value = note.title;
                        editNoteContent.value = note.content;
                        editNoteId.value = note.id;

                        fetchCategories(note.category); // Populate categories and select the current one
                        editNoteModal.style.display = 'block';
                    } else {
                        throw new Error(data.message || 'Failed to fetch note details');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert(error.message || 'Failed to fetch note details. Please try again.');
                });
        }

        function fetchCategories(selectedCategory = '') {
            console.log('Fetching categories...');
            fetch('get_categories.php')
                .then(response => response.json())
                .then(data => {
                    console.log('Received data:', data);
                    if (data.success && Array.isArray(data.categories)) {
                        const editNoteCategory = document.getElementById('editNoteCategory');
                        if (!editNoteCategory) {
                            console.error('editNoteCategory element not found');
                            return;
                        }

                        editNoteCategory.innerHTML = ''; // Clear existing options

                        // Add "All" option
                        const allOption = document.createElement('option');
                        allOption.value = "all";
                        allOption.textContent = "All";
                        editNoteCategory.appendChild(allOption);

                        // Add other categories
                        data.categories.forEach(category => {
                            console.log('Adding category:', category);
                            const option = document.createElement('option');
                            option.value = category;
                            option.textContent = category;
                            editNoteCategory.appendChild(option);
                        });

                        // Set the selected category
                        if (selectedCategory && data.categories.includes(selectedCategory)) {
                            editNoteCategory.value = selectedCategory;
                        } else {
                            editNoteCategory.value = "all"; // Default to "All" if no category is selected or if the selected category doesn't exist
                        }

                        console.log('Categories populated:', editNoteCategory.innerHTML);
                    } else {
                        console.error('Failed to load categories or categories are not in expected format:', data);
                    }
                })
                .catch(error => {
                    console.error('Error fetching categories:', error);
                });
        }
        if (editNoteForm) {
            editNoteForm.addEventListener('submit', function (e) {
                e.preventDefault(); 

                const title = editNoteTitle.value.trim();
                const content = editNoteContent.value.trim();
                const category = editNoteCategory.value;
                const id = editNoteId.value;

                if (!title || !content || !category) {
                    alert('Please fill in all fields');
                    return;
                }

                const noteData = {
                    id: id,
                    title: title,
                    content: content,
                    category: category
                };

                console.log('Sending note data:', noteData);

                fetch('edit_note.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(noteData)
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            const noteCard = document.querySelector(`.note-card[data-id="${id}"]`);
                            if (noteCard) {
                                noteCard.querySelector('h3').textContent = title;
                                noteCard.querySelector('p').textContent = content.substring(0, 100) + '...';
                                noteCard.querySelector('.category').textContent = category;
                                noteCard.setAttribute('data-category', category);
                            }
                            editNoteForm.reset();
                            editNoteModal.style.display = 'none';
                        } else {
                            throw new Error(data.message || 'Failed to update note');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert(error.message || 'Failed to update note. Please try again.');
                    });
            });
        }
        else {
            console.error('Edit note form not found');
        }

        if (closeEditModalButton) {
            closeEditModalButton.addEventListener('click', function () {
                editNoteModal.style.display = 'none';
            });
        } else {
            console.error('Close edit modal button not found');
        }

        window.addEventListener('click', function (event) {
            if (event.target === editNoteModal) {
                editNoteModal.style.display = 'none';
            }
        });
    });

    // Function for search box   

        function performSearch() {
            const searchTerm = searchInput.value.toLowerCase();
            const noteCards = document.querySelectorAll('.note-card');

            noteCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const category = card.querySelector('.category').textContent.toLowerCase();

                if (title.includes(searchTerm) || category.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        searchButton.addEventListener('click', performSearch);

        searchInput.addEventListener('keyup', function (event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });

        // Add this to your existing showAllNotes event listener
        document.getElementById('showAllNotes').addEventListener('click', function () {
            const noteCards = document.querySelectorAll('.note-card');
            noteCards.forEach(card => {
                card.style.display = 'flex';
            });
            searchInput.value = ''; // Clear the search input
        });
    });
