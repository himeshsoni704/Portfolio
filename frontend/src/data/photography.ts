// ───────────────────────────────────────────────────────────
// PHOTOGRAPHY & FILM
// Every image below is a clearly-marked placeholder.
// Replace `src` with real photographs when available.
// Film video: null until Himesh provides one — [ADD VIDEO].
// ───────────────────────────────────────────────────────────

export type Photo = {
  src: string;
  alt: string;
  caption: string;
};

export const PHOTOS: Photo[] = [
  {
    src: 'https://static.prod-images.emergentagent.com/jobs/19119139-9591-4021-9742-57b7af2f3269/images/07edcea68ce40355cae466657ced231cd7b5f472e5b1ed7a4955a89329cf4ba3.jpeg',
    alt: 'Placeholder photograph — water bubbles macro',
    caption: '[ADD PHOTOGRAPH] 01',
  },
  {
    src: 'https://static.prod-images.emergentagent.com/jobs/19119139-9591-4021-9742-57b7af2f3269/images/6c545e17edac29d60511cbee3536056085320d74fc85bb261aa8602f02753217.jpeg',
    alt: 'Placeholder photograph — glass sphere study',
    caption: '[ADD PHOTOGRAPH] 02',
  },
  {
    src: 'https://static.prod-images.emergentagent.com/jobs/19119139-9591-4021-9742-57b7af2f3269/images/79fe2ed414643cc5edf8df24e15a2c1df7e4a0d229f48cf15960cb997df2fb56.jpeg',
    alt: 'Placeholder photograph — city skyline through rain on glass',
    caption: '[ADD PHOTOGRAPH] 03',
  },
  {
    src: 'https://static.prod-images.emergentagent.com/jobs/19119139-9591-4021-9742-57b7af2f3269/images/61d29cf05ccec8330bf479ca591c7fa9155315df0c67d3aa7961af7af0236bd4.jpeg',
    alt: 'Placeholder photograph — above the clouds',
    caption: '[ADD PHOTOGRAPH] 04',
  },
  {
    src: 'https://static.prod-images.emergentagent.com/jobs/19119139-9591-4021-9742-57b7af2f3269/images/38c62bf26b5806070fe672695d869fecbc66d0969580c92f448bb64d0fd7198f.jpeg',
    alt: 'Placeholder photograph — star trails long exposure',
    caption: '[ADD PHOTOGRAPH] 05',
  },
  {
    src: 'https://static.prod-images.emergentagent.com/jobs/19119139-9591-4021-9742-57b7af2f3269/images/91c16159a84dcfe290f9e12eba6502d89fc0de5c19882362c14e29763c02b6d8.jpeg',
    alt: 'Placeholder photograph — cinematic night street',
    caption: '[ADD PHOTOGRAPH] 06',
  },
  {
    src: 'https://static.prod-images.emergentagent.com/jobs/19119139-9591-4021-9742-57b7af2f3269/images/e362490a8738acda5595790acc60ed516ab2d2e3238eae8ab7330b2fdc1109a8.jpeg',
    alt: 'Placeholder photograph — aerial ocean study',
    caption: '[ADD PHOTOGRAPH] 07',
  },
  {
    src: 'https://static.prod-images.emergentagent.com/jobs/19119139-9591-4021-9742-57b7af2f3269/images/d8857d55cfe43dc349a3ee856ced5ba10e23323dd5c8b8e0fdd1c431ec154f0d.jpeg',
    alt: 'Placeholder photograph — droplet on leaf macro',
    caption: '[ADD PHOTOGRAPH] 08',
  },
];

export const FILM = {
  intro:
    'I enjoy experimenting with cameras, photography and filmmaking — mostly through the Reflexions Photography & Videography Club at BITS Dubai.',
  poster: {
    src: 'https://static.prod-images.emergentagent.com/jobs/19119139-9591-4021-9742-57b7af2f3269/images/3109efb58a30adbc889e5c1f9f24e0f80d0d810245244951a8ab8f912bf7db30.jpeg',
    alt: 'Placeholder film poster — dark corridor still',
    caption: '[ADD FILM POSTER]',
  },
  video: null as string | null, // [ADD VIDEO] — film placeholder until provided
  bts: [
    {
      src: 'https://static.prod-images.emergentagent.com/jobs/19119139-9591-4021-9742-57b7af2f3269/images/91c16159a84dcfe290f9e12eba6502d89fc0de5c19882362c14e29763c02b6d8.jpeg',
      alt: 'Placeholder behind-the-scenes still 1',
      caption: '[ADD BTS STILL] 01',
    },
    {
      src: 'https://static.prod-images.emergentagent.com/jobs/19119139-9591-4021-9742-57b7af2f3269/images/79fe2ed414643cc5edf8df24e15a2c1df7e4a0d229f48cf15960cb997df2fb56.jpeg',
      alt: 'Placeholder behind-the-scenes still 2',
      caption: '[ADD BTS STILL] 02',
    },
  ],
  gear: ['Cameras', 'Cinematography', 'Editing', 'DaVinci Resolve'],
};
