import { describe, it, expect } from 'vitest';
import '../src/editor/family-hub-card-editor.js';

// The editor is registered by the module import; construct it through the
// custom element registry rather than exporting the class purely for tests.
function makeEditor(states) {
  const Editor = customElements.get('family-hub-card-editor');
  const editor = new Editor();
  editor.hass = states ? { states } : undefined;
  const fired = [];
  editor.dispatchEvent = (e) => { fired.push(e); return true; };
  return { editor, fired };
}

const taskmateSensor = {
  state: '4',
  attributes: { todays_completions: [{ chore_id: 'c1', child_id: 'k1' }] },
};

describe('TaskMate sensor discovery', () => {
  it('finds the sensor carrying a todays_completions array', () => {
    const { editor } = makeEditor({
      'sensor.taskmate_chores': taskmateSensor,
      'sensor.outside_temperature': { state: '14', attributes: {} },
    });
    expect(editor._detectedChoresSensor()).toBe('sensor.taskmate_chores');
  });

  it('ignores entities outside the sensor domain', () => {
    const { editor } = makeEditor({
      'binary_sensor.impostor': taskmateSensor,
    });
    expect(editor._detectedChoresSensor()).toBeNull();
  });

  it('ignores a sensor whose todays_completions is not an array', () => {
    const { editor } = makeEditor({
      'sensor.nearly': { state: '0', attributes: { todays_completions: 'none' } },
    });
    expect(editor._detectedChoresSensor()).toBeNull();
  });

  it('returns null before hass is set', () => {
    const { editor } = makeEditor(null);
    expect(editor._detectedChoresSensor()).toBeNull();
  });
});

describe('config changes', () => {
  it('merges the patch into the existing config and announces it', () => {
    const { editor, fired } = makeEditor({ 'sensor.taskmate_chores': taskmateSensor });
    editor.setConfig({ type: 'custom:family-hub-card', people: [{ name: 'Ana' }] });

    editor._apply({ taskmate_chores: 'sensor.taskmate_chores' });

    expect(fired).toHaveLength(1);
    expect(fired[0].type).toBe('config-changed');
    // The rest of the config has to survive: the editor only ever edits one
    // key, and Lovelace replaces the whole card config with what it receives.
    expect(fired[0].detail.config).toEqual({
      type: 'custom:family-hub-card',
      people: [{ name: 'Ana' }],
      taskmate_chores: 'sensor.taskmate_chores',
    });
  });

  it('crosses the shadow boundary so Lovelace hears the event', () => {
    const { editor, fired } = makeEditor({});
    editor.setConfig({ type: 'custom:family-hub-card' });
    editor._apply({ view: 'agenda' });

    expect(fired[0].bubbles).toBe(true);
    expect(fired[0].composed).toBe(true);
  });
});
