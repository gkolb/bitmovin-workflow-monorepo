export const state: any = $state({ player: null });

export function loadPlayer(url: string) {
  let source = url.includes('.mpd') ? { dash: url } : { hls: url };
  state.player.load(source).then(
    () => console.info('Player loaded'),
    (e: any) => console.error('Player load error', e),
  );
}
