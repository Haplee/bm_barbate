import { spawn } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

// --- Configuration ---
const DIST_DIR = 'dist';
const STATIC_ASSETS = [
    'index.html',
    'club.html',
    'contacto.html',
    'entrenadores.html',
    'galerias.html',
    'noticias.html',
    'css',
    'js',
    'data/photos',
];
const TEAMS_TEMPLATE_PATH = 'equipos.html';
const TEAMS_DATA_PATH = 'data/teams.json';
const STAFF_DATA_PATH = 'data/staff.json';

// --- Helper Functions ---

/**
 * Executes a command in a child process and returns a promise.
 * @param {string} command - The command to execute.
 * @param {string[]} args - The arguments for the command.
 * @returns {Promise<void>}
 */
function runCommand(command, args) {
    return new Promise((resolve, reject) => {
        console.log(`Running command: ${command} ${args.join(' ')}`);
        const child = spawn(command, args, { stdio: 'inherit' });

        child.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Command failed with code ${code}: ${command} ${args.join(' ')}`));
            } else {
                resolve();
            }
        });

        child.on('error', (err) => {
            reject(new Error(`Failed to start command: ${command} ${args.join(' ')}\n${err.message}`));
        });
    });
}

/**
 * Creates an HTML card for a player.
 * @param {object} player - The player object.
 * @returns {string} - The HTML string for the player card.
 */
function createPlayerCard(player) {
    const playerName = player.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    // Use a default placeholder if image is missing
    const playerImage = player.image ? `../${player.image}` : 'https://via.placeholder.com/150';
    return `
        <div class="player-card">
            <img src="${playerImage}" alt="Foto de ${playerName}" loading="lazy">
            <h4>${playerName}</h4>
        </div>
    `;
}

/**
 * Generates the full HTML for all teams based on the data.
 * @param {object[]} teamsData - The array of team objects from JSON.
 * @returns {string} - The complete HTML block for all teams.
 */
function generateTeamsHtml(teamsData) {
    let allTeamsHtml = '';

    // We assume all teams are for 'pista' as per original logic.
    // The 'playa' section will be identical for now.
    teamsData.forEach(team => {
        const playersHtml = team.players.map(createPlayerCard).join('');
        const coachesHtml = team.coaches.map(coach => `<li>${coach.name} (${coach.role})</li>`).join('');

        allTeamsHtml += `
            <div class="team-entry" data-category="${team.category_slug}">
                <h3 class="team-name">${team.team_name}</h3>
                <div class="player-grid">
                    ${playersHtml}
                </div>
                ${coachesHtml ? `<h4>Cuerpo Técnico</h4><ul>${coachesHtml}</ul>` : ''}
            </div>
        `;
    });

    return allTeamsHtml;
}

/**
 * Generates the HTML for the filter buttons.
 * @param {object[]} teamsData - The array of team objects from JSON.
 * @returns {string} - The HTML for the filter buttons.
 */
function generateFiltersHtml(teamsData) {
    const categories = new Set();
    teamsData.forEach(team => {
        categories.add(JSON.stringify({
            slug: team.category_slug,
            name: team.category_name
        }));
    });

    let filterHtml = '<button class="tab-button active" data-category="all">Todos</button>';
    const parsedCategories = Array.from(categories).map(cat => JSON.parse(cat));
    parsedCategories.sort((a, b) => a.name.localeCompare(b.name));

    parsedCategories.forEach(category => {
        filterHtml += `<button class="tab-button" data-category="${category.slug}">${category.name}</button>`;
    });

    return filterHtml;
}


// --- Main Build Process ---

async function main() {
    try {
        console.log('--- Starting build process ---');

        // 1. Clean and create destination directory
        console.log(`Cleaning and creating directory: ${DIST_DIR}`);
        await fs.emptyDir(DIST_DIR);

        // 2. Install Python dependencies and run scraper (DISABLED)
        // console.log('--- Installing Python dependencies ---');
        // await runCommand('pip', ['install', '-r', 'requirements.txt']);

        // console.log('--- Running data scraper (DISABLED) ---');
        // await runCommand('python', ['scripts/update_teams.py']);
        // console.log('Data scraping complete.');

        // 3. Pre-render the teams page
        console.log('--- Pre-rendering teams page ---');
        const teamsTemplate = await fs.readFile(TEAMS_TEMPLATE_PATH, 'utf-8');
        const teamsData = await fs.readJson(TEAMS_DATA_PATH);

        // Generate dynamic content
        const teamsHtml = generateTeamsHtml(teamsData);
        const filtersHtml = generateFiltersHtml(teamsData);

        // Inject content into the template
        const placeholderPista = `     <div id="teams-container">
      <!-- El contenido se cargará dinámicamente desde teams.json -->
     </div>`;
        const placeholderFiltrosPista = '<div class="tabs-container" id="team-filters"></div>';
        const placeholderPlaya = `     <div id="beach-teams-container">
      <!-- El contenido se cargará dinámicamente desde teams.json -->
     </div>`;
        const placeholderFiltrosPlaya = '<div class="tabs-container" id="beach-team-filters"></div>';

        let finalHtml = teamsTemplate
            .replace(placeholderPista, `<div id="teams-container">${teamsHtml}</div>`)
            .replace(placeholderFiltrosPista, `<div class="tabs-container" id="team-filters">${filtersHtml}</div>`)
            .replace(placeholderPlaya, `<div id="beach-teams-container">${teamsHtml}</div>`)
            .replace(placeholderFiltrosPlaya, `<div class="tabs-container" id="beach-team-filters">${filtersHtml}</div>`);

        // Adjust asset paths for the new directory structure (e.g., css/styles.css -> ../css/styles.css)
        finalHtml = finalHtml.replace(/href="css\//g, 'href="../css/');
        finalHtml = finalHtml.replace(/src="js\//g, 'src="../js/');
        finalHtml = finalHtml.replace(/href="assets\//g, 'href="../assets/');
        finalHtml = finalHtml.replace(/href="([^"]+\.html)"/g, 'href="../$1"'); // Adjust HTML links
        finalHtml = finalHtml.replace(/href="index.html"/g, 'href="../index.html"');
        finalHtml = finalHtml.replace('src="http://balonmano.isquad.es/images/afiliacion_clubs/100165/square_6467683739316b316233.jpg"', 'src="https://balonmano.isquad.es/images/afiliacion_clubs/100165/square_6467683739316b316233.jpg"');

        const outputTeamsPath = path.join(DIST_DIR, TEAMS_TEMPLATE_PATH);
        await fs.ensureDir(path.dirname(outputTeamsPath));
        await fs.writeFile(outputTeamsPath, finalHtml);
        console.log(`Successfully generated ${outputTeamsPath}`);

        // 4. Copy static assets
        console.log('--- Copying static assets ---');
        for (const asset of STATIC_ASSETS) {
            const srcPath = path.resolve(asset);
            const destPath = path.join(DIST_DIR, asset);
            if (await fs.pathExists(srcPath)) {
                await fs.copy(srcPath, destPath);
                console.log(`Copied ${asset} to ${destPath}`);
            } else {
                console.warn(`Warning: Asset not found and not copied: ${srcPath}`);
            }
        }

        console.log('--- Build process complete! ---');
        console.log(`Output is in the '${DIST_DIR}' directory.`);

    } catch (error) {
        console.error('--- Build process failed ---');
        console.error(error);
        process.exit(1); // Exit with an error code
    }
}

main();
