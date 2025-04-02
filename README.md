# ImgSherlock - AI Image Detector

ImgSherlock is a web application that uses Google's Gemini AI model to analyze and detect whether an image is AI-generated or authentic. This application helps users identify content created by AI tools like DALL·E, Midjourney, and Stable Diffusion.

## Features

- Upload images via drag-and-drop or file selection
- Advanced AI-powered image analysis for AI-generation detection
- Visual confidence meter displaying detection certainty
- Detailed analysis report for each image
- Responsive design for all devices

## Technology Stack

- **Frontend**: React, JavaScript, CSS3
- **Backend**: Node.js/Express (to be implemented)
- **AI Model**: Google Gemini (via API)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/imgsherlock.git
   cd imgsherlock
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Environment Configuration

Create a `.env` file in the project root with the following variables:

```
VITE_ENV=development
VITE_API_URL=http://localhost:5000/api
```

For production:
```
VITE_ENV=production
```

## Backend Integration

The frontend is designed to work with a backend API that integrates with Google's Gemini model. By default, it uses a mock API for testing purposes.

To switch to a real backend:
1. Set up your backend server (Node.js/Express recommended)
2. Create the `/detect` endpoint that accepts image uploads
3. Set `VITE_ENV=production` in your `.env` file

## API Endpoints

The frontend expects the following endpoint:

- `POST /api/detect` - Upload and analyze an image
  - Accepts a file upload with key 'image'
  - Returns JSON with `isAiGenerated`, `confidence`, and `details` fields

## Deployment

To build for production:

```
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google's Gemini model for AI detection capabilities
- React and Vite for the frontend framework
- React Dropzone for the file upload functionality
