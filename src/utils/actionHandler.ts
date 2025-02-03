interface ActionData {
  text?: string;
  button_id?: string;
  direction?: string;
  form_data?: Record<string, unknown>;
  element?: string;
  link_id?: string;
  key?: string;
  context?: string;
  field?: string;
}

interface ActionResponse {
  action_type: string;
  status: string;
  timestamp: string;
  button_action?: string;
}

export const handleAction = async (
  action_type: string,
  action_data: ActionData
): Promise<ActionResponse> => {
  try {
    // Fire and forget - don't await the response
    fetch('https://webdevs.applytocollege.pk/handle_action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action_type,
        action_data,
      }),
    });

    // Return immediately with a default response
    return {
      action_type,
      status: 'sent',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error handling action:', error);
    return {
      action_type,
      status: 'error',
      timestamp: new Date().toISOString(),
    };
  }
};