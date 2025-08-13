import { useNotification } from '../../contexts/NotificationContext';

describe('NotificationContext Export', () => {
  it('should export useNotification', () => {
    expect(useNotification).toBeDefined();
    expect(typeof useNotification).toBe('function');
  });
});
