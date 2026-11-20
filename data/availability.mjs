export const PROJECT_TRACKING_DEFAULTS = {
  signupOpen: true,
  capacity: null,
  confirmedSpots: 0,
  completionPercent: 0
};

export function projectAvailability(project) {
  const remainingSpots = project.capacity === null ? null : project.capacity - project.confirmedSpots;
  const signupStatus = project.completed ? 'completed'
    : !project.signupOpen ? 'paused'
    : remainingSpots === 0 ? 'full' : 'open';
  return {signupStatus, remainingSpots};
}

export function signupLabel(status) {
  return {
    open: 'Sign-ups open',
    paused: 'Sign-ups paused',
    full: 'All spots filled',
    completed: 'Project completed'
  }[status];
}

export function spotsLabel(remaining) {
  if (remaining === null) return 'No spot limit';
  return remaining === 1 ? '1 spot remaining' : remaining + ' spots remaining';
}
