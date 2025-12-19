const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'database.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize database file if it doesn't exist
function initializeDatabase() {
    if (!fs.existsSync(path.dirname(DATA_FILE))) {
        fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    }
    
    if (!fs.existsSync(DATA_FILE)) {
        const initialData = {
            projects: [
                {
                    id: 1,
                    name: "E-commerce Platform",
                    description: "A full-featured e-commerce platform with payment integration and inventory management.",
                    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    category: "Design & Development",
                    location: "Remote"
                },
                {
                    id: 2,
                    name: "Healthcare App",
                    description: "Mobile application for healthcare providers to manage patient records and appointments.",
                    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    category: "Mobile Development",
                    location: "New York"
                },
                {
                    id: 3,
                    name: "Corporate Website",
                    description: "A responsive corporate website with CMS integration and SEO optimization.",
                    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    category: "Web Design",
                    location: "San Francisco"
                }
            ],
            clients: [
                {
                    id: 1,
                    name: "Rowhan Smith",
                    designation: "CEO, Feverbearer",
                    description: "Working with Flipr Digital was a game-changer for our business. Their team delivered exceptional results.",
                    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                },
                {
                    id: 2,
                    name: "Shijpa Kayak",
                    designation: "Brand Designer",
                    description: "The design team at Flipr Digital is incredibly talented. They understood our vision perfectly.",
                    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                },
                {
                    id: 3,
                    name: "John Lepore",
                    designation: "CEO, TechSolutions",
                    description: "Their marketing strategies increased our conversion rate by 40% in just three months.",
                    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                }
            ],
            contacts: [],
            newsletter: [],
            activity: [
                {
                    id: 1,
                    icon: "fa-project-diagram",
                    title: "New Project Added",
                    description: "E-commerce Platform project was added to the portfolio",
                    time: "2 hours ago"
                },
                {
                    id: 2,
                    icon: "fa-users",
                    title: "New Client Added",
                    description: "Rowhan Smith was added to happy clients",
                    time: "1 day ago"
                },
                {
                    id: 3,
                    icon: "fa-envelope",
                    title: "New Contact Form Submission",
                    description: "John Doe submitted a contact form",
                    time: "2 days ago"
                }
            ]
        };
        
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    }
}

// Read database
function readDatabase() {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
}

// Write to database
function writeDatabase(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Generate a new ID
function generateId(items) {
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
}

// Initialize database on startup
initializeDatabase();

// API Routes

// Get all projects
app.get('/api/projects', (req, res) => {
    const data = readDatabase();
    res.json(data.projects);
});

// Add a new project
app.post('/api/projects', (req, res) => {
    const data = readDatabase();
    const newProject = {
        id: generateId(data.projects),
        ...req.body,
        date: new Date().toISOString()
    };
    
    data.projects.push(newProject);
    
    // Add to activity log
    data.activity.unshift({
        id: generateId(data.activity),
        icon: "fa-project-diagram",
        title: "New Project Added",
        description: `${newProject.name} was added to the portfolio`,
        time: "Just now"
    });
    
    writeDatabase(data);
    res.status(201).json(newProject);
});

// Delete a project
app.delete('/api/projects/:id', (req, res) => {
    const data = readDatabase();
    const id = parseInt(req.params.id);
    const index = data.projects.findIndex(p => p.id === id);
    
    if (index !== -1) {
        const deletedProject = data.projects.splice(index, 1)[0];
        
        // Add to activity log
        data.activity.unshift({
            id: generateId(data.activity),
            icon: "fa-project-diagram",
            title: "Project Deleted",
            description: `${deletedProject.name} was removed from the portfolio`,
            time: "Just now"
        });
        
        writeDatabase(data);
        res.json({ message: 'Project deleted successfully' });
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
});

// Get all clients
app.get('/api/clients', (req, res) => {
    const data = readDatabase();
    res.json(data.clients);
});

// Add a new client
app.post('/api/clients', (req, res) => {
    const data = readDatabase();
    const newClient = {
        id: generateId(data.clients),
        ...req.body,
        date: new Date().toISOString()
    };
    
    data.clients.push(newClient);
    
    // Add to activity log
    data.activity.unshift({
        id: generateId(data.activity),
        icon: "fa-users",
        title: "New Client Added",
        description: `${newClient.name} was added to happy clients`,
        time: "Just now"
    });
    
    writeDatabase(data);
    res.status(201).json(newClient);
});

// Delete a client
app.delete('/api/clients/:id', (req, res) => {
    const data = readDatabase();
    const id = parseInt(req.params.id);
    const index = data.clients.findIndex(c => c.id === id);
    
    if (index !== -1) {
        const deletedClient = data.clients.splice(index, 1)[0];
        
        // Add to activity log
        data.activity.unshift({
            id: generateId(data.activity),
            icon: "fa-users",
            title: "Client Deleted",
            description: `${deletedClient.name} was removed from happy clients`,
            time: "Just now"
        });
        
        writeDatabase(data);
        res.json({ message: 'Client deleted successfully' });
    } else {
        res.status(404).json({ message: 'Client not found' });
    }
});

// Get all contact form submissions
app.get('/api/contacts', (req, res) => {
    const data = readDatabase();
    res.json(data.contacts);
});

// Submit a contact form
app.post('/api/contacts', (req, res) => {
    const data = readDatabase();
    const newContact = {
        id: generateId(data.contacts),
        ...req.body,
        date: new Date().toISOString()
    };
    
    data.contacts.unshift(newContact);
    
    // Add to activity log
    data.activity.unshift({
        id: generateId(data.activity),
        icon: "fa-envelope",
        title: "New Contact Form Submission",
        description: `${newContact.fullname} submitted a contact form`,
        time: "Just now"
    });
    
    writeDatabase(data);
    res.status(201).json(newContact);
});

// Get all newsletter subscribers
app.get('/api/newsletter', (req, res) => {
    const data = readDatabase();
    res.json(data.newsletter);
});

// Subscribe to newsletter
app.post('/api/newsletter', (req, res) => {
    const data = readDatabase();
    const { email } = req.body;
    
    // Check if already subscribed
    if (data.newsletter.some(sub => sub.email === email)) {
        return res.status(400).json({ message: 'Email already subscribed' });
    }
    
    const newSubscriber = {
        id: generateId(data.newsletter),
        email,
        date: new Date().toISOString()
    };
    
    data.newsletter.unshift(newSubscriber);
    
    // Add to activity log
    data.activity.unshift({
        id: generateId(data.activity),
        icon: "fa-newspaper",
        title: "New Newsletter Subscriber",
        description: `${email} subscribed to the newsletter`,
        time: "Just now"
    });
    
    writeDatabase(data);
    res.status(201).json(newSubscriber);
});

// Get recent activity
app.get('/api/activity', (req, res) => {
    const data = readDatabase();
    res.json(data.activity.slice(0, 5)); // Return only 5 most recent activities
});

// Serve frontend files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'admin.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Frontend: http://localhost:${PORT}`);
    console.log(`Admin Panel: http://localhost:${PORT}/admin`);
});