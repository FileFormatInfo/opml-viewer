
const isDevMode = process.env.NODE_ENV === 'development';

const DEMO_URL = isDevMode
    ? "http://localhost:4000/newsblur.xml"
    : "https://opml.xml.style/demo.xml";

export const constants = {
    DEFAULT_HOME: "Home Page",
    DEFAULT_URL: "https://your-website-here/opml.xml",
    DEFAULT_TITLE: "Outline",
    DEMO_URL,
};