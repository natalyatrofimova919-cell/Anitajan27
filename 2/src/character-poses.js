// Character texture keys for Phaser 3.
export const GIRL = {
  idleRight: 'girl-stand-right',
  idleLeft: 'girl-stand-left',
  jumpRight: 'girl-jump-right',
  jumpLeft: 'girl-jump-left',
  jumpCrouchRight: 'girl-jump-crouch-right',
  jumpCrouchLeft: 'girl-jump-crouch-left',
  backView: 'girl-back-view',
  victory: 'girl-jump-with-spark'
};
export function chooseGirlPose({ velocityY = 0, velocityX = 0 }) {
  const dir = velocityX < -8 ? 'Left' : 'Right';
  if (velocityY < -20) return GIRL['jump' + dir];
  if (velocityY > 30) return GIRL['jumpCrouch' + dir];
  return GIRL['idle' + dir];
}
