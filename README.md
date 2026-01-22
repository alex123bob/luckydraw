# Lucky Draw Web Application

A responsive web application for conducting random lucky draws from a list of users with full user management capabilities.

![Lucky Draw Screenshot](https://img.shields.io/badge/Status-Live-success) ![License](https://img.shields.io/badge/License-MIT-blue)

## Features

### 🎯 Core Functionality
- **Random Draw**: Execute random selection with animated visual effects
- **User Management**: Add, edit, and delete users with validation
- **Winner Tracking**: Keep history of all previous winners with timestamps
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### 🛠️ User Management
- **Add Users**: Input names with duplicate prevention
- **Edit Users**: Modify existing user names
- **Delete Users**: Remove individual users with confirmation
- **Clear All**: Remove all users at once (with confirmation)
- **Default List**: Pre-loaded with 20 Chinese names for quick start

### 📊 Data Management
- **Local Storage**: Automatically saves data to browser
- **Export Data**: Download all users and winners as JSON
- **Import Data**: Upload JSON files to replace current data
- **Load Defaults**: Restore original 20-user list
- **Clear Winners**: Remove all winner history

### 🎨 UI/UX Features
- **Modern Design**: Gradient backgrounds and smooth animations
- **Visual Feedback**: Toast notifications for all actions
- **Animated Draw**: Visual selection animation before revealing winner
- **Responsive Layout**: Adapts to all screen sizes
- **Accessible**: Keyboard navigation and screen reader friendly

## Quick Start

### Prerequisites
- Node.js 14+ and npm

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/luckydraw.git
cd luckydraw

# Install dependencies
npm install

# Development (with live reload)
npm run dev

# Production build
npm run build
```

The application will be available at `http://localhost:3000`

## Usage Guide

### Adding Users
1. Type a name in the "Enter user name..." field
2. Click "Add User" or press Enter
3. Users appear in the list with edit/delete buttons

### Conducting a Draw
1. Ensure you have at least one user in the list
2. Click "Execute Draw" button
3. Watch the animated selection process
4. Winner is displayed with celebration message
5. Winner is automatically added to history

### Managing Data
- **Export**: Click "Export Data" to download current data as JSON
- **Import**: Click "Import Data" to upload and replace with JSON file
- **Load Defaults**: Click "Load Default Users" to restore original list
- **Clear All**: Click "Clear All Users" to remove all users
- **Clear Winners**: Click "Clear Winners" to remove winner history

## Project Structure

```
luckydraw/
├── public/
│   └── index.html          # Main application HTML (development)
├── css/
│   └── style.css           # Responsive styles with animations
├── js/
│   └── app.js              # Core application logic
├── data/
│   └── default-users.json  # Default user list (20 Chinese names)
├── dist/                   # BUILD OUTPUT (generated)
│   ├── index.html          # Processed HTML for production
│   ├── css/style.css       # Copied CSS
│   ├── js/app.js           # Copied JavaScript
│   ├── data/default-users.json
│   └── nginx-example.conf  # Example nginx config
├── build.js                # Build script
├── server.js               # Express server (development only)
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## Default User List

The application comes pre-loaded with 20 Chinese names:
- 姚镇, 钱聪, 还向华, 饶艳, 余蓉
- 朱晓倩, 李嘉, 郑杭, 马江龙, 吴秋韵
- 蔡金磊, 江朝朝, 刘青, 许慧娟, 苑超
- 刘亦韬, 潘晓璋, 吴玉媛, 聂宇琦, 张涛

## Technical Details

### Technologies Used
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Node.js with Express
- **Styling**: Custom CSS with Flexbox/Grid, Font Awesome icons
- **Storage**: Browser LocalStorage API
- **Animations**: CSS keyframes and JavaScript animations

### Key Features Implementation
- **Random Selection**: `Math.random()` with weighted slowing animation
- **Data Persistence**: LocalStorage with automatic save/load
- **Responsive Design**: CSS Grid with media queries
- **Error Handling**: Comprehensive validation and user feedback
- **Accessibility**: ARIA labels and keyboard navigation support

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Opera 47+

## Development

### Running in Development Mode
```bash
npm run dev  # Uses nodemon for auto-reload
```

The development server runs at `http://localhost:6006` and serves files from source directories.

## Build System

### Building for Production
The application includes a build system that creates static files for nginx/Apache deployment:

```bash
# Build for /luckydraw/ subdirectory (default)
npm run build

# Build for root deployment
npm run build:root

# Build for custom path
BASE_PATH='/custom/path/' node build.js

# Preview the build locally
npm run preview
```

### Build Output
The build creates a `dist/` folder with:
- `index.html` - Processed HTML with correct paths
- `css/style.css` - Copied CSS file
- `js/app.js` - Copied JavaScript file
- `data/default-users.json` - Default user data
- `nginx-example.conf` - Example nginx configuration

## Deployment

### Option 1: Static Files (Recommended)
1. Build the application: `npm run build`
2. Copy `dist/` contents to your web server
3. Configure nginx/Apache to serve the files

Example nginx configuration for `/luckydraw/`:
```nginx
location /luckydraw {
    alias /path/to/dist;
    try_files $uri $uri/ /luckydraw/index.html;
}
```

### Option 2: Node.js Server
For development or small deployments:
```bash
# Start production server
npm start

# With custom port
PORT=8080 npm start

# Using PM2 for production
pm2 start server.js --name "luckydraw"
```

### Environment Variables
- `PORT`: Server port (default: 6006)
- `BASE_PATH`: Base path for static builds (default: `/luckydraw/`)

### Adding Features
1. Modify `js/app.js` for logic changes
2. Update `css/style.css` for styling changes
3. Edit `public/index.html` for structural changes

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues or questions:
1. Check the [Issues](https://github.com/yourusername/luckydraw/issues) page
2. Create a new issue with detailed description

---

**Enjoy your lucky draws!** 🎉