# NecroWiKi Frontend

This repository contains the Angular web interface for the **NecroWiKi** project, a central access point for a collection of services, communities, and retro/online games organized around a shared visual identity and navigation experience.

The frontend acts as the main portal for the NecroWiKi experience, connecting:

- a home page with categories and external links;
- account registration flows for games and communities;
- an arcade game catalog organized by platform;
- a tutorial blog with Markdown articles, image uploads, and native video playback;
- portal accounts with Admin/User roles and an arcade-only Guest mode;
- ROM playback through a web-based emulator library using local `EmulatorJS` assets;
- integrations with external services and backend APIs.

## Overview

The application is built as an Angular 21 SPA with dynamic routing and standalone components. The main navigation is defined in `src/app/app.routes.ts`, while the portal navigation and link configuration lives in `src/app/config/wiki.config.ts`.

The experience is organized around these main areas:

- `home`: main portal page;
- `register/:type`: community/game registration flows;
- `tutorials`: tutorial feed, with category and article routes;
- `arcade/:system`: ROM library by arcade system;
- `arcade/:system/play`: game playback screen using the app player.
- `account`: login, registration, or Guest entry;
- `admin`: Admin-only portal account management.

## Main features

### Wiki portal

The landing page presents the NecroWiKi ecosystem with sections such as:

- NecroHome
- NecroFlix
- NecroArcade
- classic game services such as WoW, Ragnarok Online, Diablo II, and retro platforms.

### Account registration

The project includes a custom registration configuration in `register.config.ts`, with visual themes and form fields adapted for each game or community.

### Arcade library

The arcade area is handled by the `GameSystemService`, which communicates with the backend to list ROMs and upload files for a specific system.

The gamesystem page includes:

- name search;
- sorting;
- ROM upload;
- opening the player view with system and ROM parameters.

### Tutorials

The tutorial area lists articles by game category, renders uploaded Markdown with relative image links, and includes an optional native video player for direct MP4, WebM, or OGG URLs. Publishing stores the Markdown and images in the backend's persistent tutorial directory.

Signed-in users can search tutorials and manage their own articles; Admins can manage all tutorials. Guest sessions can access the arcade only and do not synchronize save states.

### EmulatorJS

The `public/emulatorjs` directory contains the local web emulator infrastructure used to run ROMs directly in the browser.

## Technology stack

- Angular 21
- TypeScript
- RxJS
- PrimeNG
- PrimeIcons
- Angular Router
- Vitest
- EmulatorJS

## Project structure

```text
src/
  app/
    components/       - UI components and arcade/register flows
    tutorials/        - tutorial feed, Markdown articles, and publishing form
    config/           - wiki and registration configuration
    home/             - homepage
    layout/           - header, sidebar, shell, footer
    models/           - model interfaces
    services/         - backend integration services
  environments/       - local and production API configuration
public/
  emulatorjs/         - web emulator and local assets
```

## How to run

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Then open the application at:

```text
http://localhost:4200/
```

## How to build

```bash
npm run build
```

## Backend repository

The API and services behind NecroWiKi are hosted in the separate repository:

[NecroHome/NecroWiKi.Backend](https://github.com/NecroHome/NecroWiKi.Backend)

## Docker Compose

The frontend repository uses a simple container definition. The compose file can be configured with:

```yaml
services:
  angular-app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: necro-wiki-client
    ports:
      - "6019:80"
    restart: always
    networks:
      - necro_network

networks:
  necro_network:
    external: true
```

For the web UI, adjust only:

- the web page port (`6019:80`);
- the container name (`necro-wiki-client`);
- the Docker network name (`necro_network`), which must be the same network used by the backend repository.
