import "./styles.css";
import { loadProjects } from "./storage.js";
import { displayProjects } from './dom.js';

document.addEventListener('DOMContentLoaded', () => {
    const projects = loadProjects();
    displayProjects(projects);
});