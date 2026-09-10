const SERVER_IP: string = '192.168.70.8';

export interface WikiLink {
    label: string;
    route: string;
    icon?: string;
    image?: string;
    severity?: 'success' | 'info' | 'warn' | 'danger' | 'help' | 'secondary' | 'contrast';
    external?: true | false;
}


export interface WikiItem {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    theme: string;
    route: string;
    links: WikiLink[];
}


export const WIKI_CONFIG: WikiItem[] = [
    {
        id: 'necrohome',
        title: 'NecroHome',
        subtitle: 'Projetos e utilidades',
        image: '/images/necro_home.png',
        theme: 'necrohome',
        route: '/necrohome',

        links: [
            {
                label: 'NecroFinances',
                route: `http://${SERVER_IP}:6001`,
                image: '/images/necro_finances.png',
                severity: 'success',
                external: true
            },
            {
                label: 'NecroClock',
                route: `http://${SERVER_IP}:6005`,
                image: '/images/necro_clock.png',
                severity: 'info',
                external: true
            }
        ]
    },
    {
        id: 'necroflix',
        title: 'NecroFlix',
        subtitle: 'Jellyfin | Sonarr | Radarr | Lidarr',
        image: '/images/jellyfin.png',
        theme: 'necroflix',
        route: '/necroflix',

        links: [
            {
                label: 'Jellyfin',
                route: `http://${SERVER_IP}:8096`,
                image: '/images/jellyfin.png',
                severity: 'info',
                external: true
            },
            {
                label: 'Sonarr',
                route: `http://${SERVER_IP}:6008`,
                image: '/images/sonarr.png',
                severity: 'info',
                external: true
            },
            {
                label: 'Radarr',
                route: `http://${SERVER_IP}:6009`,
                image: '/images/radarr.png',
                severity: 'warn',
                external: true
            },
            {
                label: 'Lidarr',
                route: `http://${SERVER_IP}:6012`,
                image: '/images/lidarr.png',
                severity: 'help',
                external: true
            },
            {
                label: 'Bazarr',
                route: `http://${SERVER_IP}:6007`,
                image: '/images/bazarr.png',
                severity: 'secondary',
                external: true
            },
            {
                label: 'Prowlarr',
                route: `http://${SERVER_IP}:6010`,
                image: '/images/prowlarr.png',
                severity: 'contrast',
                external: true
            },
            {
                label: 'qBittorrent',
                route: `http://${SERVER_IP}:6006`,
                image: '/images/qbittorrent.png',
                severity: 'success',
                external: true
            }
        ]
    },
    {
        id: 'wow',
        title: 'NecroHome - WoW 3.3.5',
        subtitle: 'Wrath of the Lich King',
        image: '/images/wotlk.png',
        theme: 'wow',
        route: '/wow',

        links: [
            {
                label: 'Cadastrar',
                route: '/register/wow',
                icon: 'pi pi-user',
                severity: 'warn'
            },
            {
                label: 'Download',
                route: '/download/wow',
                icon: 'pi pi-download',
                severity: 'warn'
            },
            {
                label: 'Tutoriais',
                route: '/tutorials/wow',
                icon: 'pi pi-book',
                severity: 'warn'
            }
        ]
    },
    {
        id: 'ragnarok',
        title: 'NecRO - Ragnarok Online',
        subtitle: 'Pre-Renewal',
        image: '/images/ragnarok.png',
        theme: 'ragnarok',
        route: '/ragnarok',

        links: [
            {
                label: 'Cadastrar',
                route: '/register/ragnarok',
                icon: 'pi pi-user',
                severity: 'info'
            },
            {
                label: 'Download',
                route: '/download/ragnarok',
                icon: 'pi pi-download',
                severity: 'info'
            },
            {
                label: 'Tutoriais',
                route: '/tutorials/ragnarok',
                icon: 'pi pi-book',
                severity: 'info'
            }
        ]
    },
    {
        id: 'diablo2',
        title: 'NecroD2 - 1.14d',
        subtitle: 'Lord of Destruction',
        image: '/images/diablo2.png',
        theme: 'diablo',
        route: '/diablo2',

        links: [
            {
                label: 'Download',
                route: '/diablo2/download',
                icon: 'pi pi-download',
                severity: 'danger'
            },
            {
                label: 'Tutoriais',
                route: '/diablo2/tutorials',
                icon: 'pi pi-book',
                severity: 'danger'
            }
        ]
    },
    {
        id: 'arcade',
        title: 'NecroArcade',
        subtitle: 'SNES | PS1 | N64 | GBA',
        image: '/images/n64.png',
        theme: 'arcade',
        route: '/arcade',

        links: [
            {
                label: 'SNES',
                route: '/arcade/snes',
                image: '/images/sness.png',
                severity: 'success'
            },
            {
                label: 'GBA',
                route: '/arcade/gba',
                image: '/images/gba.png',
                severity: 'info'
            },
            {
                label: 'N64',
                route: '/arcade/n64',
                image: '/images/nintendo64.png',
                severity: 'warn'
            },
            {
                label: 'PS1',
                route: '/arcade/ps1',
                image: '/images/ps1.png',
                severity: 'danger'
            },
            {
                label: 'Tutoriais',
                route: '/arcade/tutorials',
                icon: 'pi pi-book',
                severity: 'help'
            }
        ]
    },
];