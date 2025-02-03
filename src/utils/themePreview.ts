interface ThemePreviewResponse {
  search_query: string;
  reasoning?: string;
  preview_url: string;
  served_url?: string;
  raw_response?: string;
  plain_description?: string;
}

const getFallbackData = (formData: Record<string, string>, reason: string): ThemePreviewResponse => {
  // Enhanced fallback URLs based on category and goal
  const getCategoryUrl = (category: string, goal: string) => {
    const categoryUrls: Record<string, string> = {
      'Ecommerce': goal === 'Make passive income' 
        ? 'https://shopify.com/examples/dropshipping'
        : 'https://shopify.com/examples',
      'Portfolio': goal === 'Generate leads'
        ? 'https://www.wix.com/website/templates/html/portfolio-and-cv'
        : 'https://www.wix.com/website/templates/html/portfolio',
      'Blogs': 'https://wordpress.com/themes/blog',
      'Events': 'https://www.squarespace.com/templates/events',
    };
    
    // If no specific category match, try to match by goal
    const goalUrls: Record<string, string> = {
      'Make passive income': 'https://shopify.com/examples',
      'Inform people': 'https://wordpress.com/themes/blog',
      'Build a community': 'https://www.wix.com/website/templates/html/community',
      'Generate leads': 'https://www.squarespace.com/templates/professional-services'
    };

    return categoryUrls[category] || goalUrls[goal] || 'https://example.com';
  };

  const previewUrl = getCategoryUrl(formData.category, formData.goal);
  console.log('Using fallback URL:', previewUrl, 'for category:', formData.category, 'and goal:', formData.goal);

  return {
    search_query: `${formData.category || 'professional'} ${formData.websiteName || 'business'} website template`,
    reasoning: reason,
    preview_url: previewUrl,
    plain_description: constructPlainDescription(formData),
    served_url: previewUrl
  };
};

const constructPlainDescription = (formData: Record<string, string>): string => {
  // Convert form data into a natural business description
  let description = '';
  
  if (formData.websiteName) {
    description += `I run ${formData.websiteName}`;
  }
  
  if (formData.websiteDescription) {
    description += description ? ` which ${formData.websiteDescription}` : `I run a business that ${formData.websiteDescription}`;
  }
  
  if (formData.category) {
    description += `. It's in the ${formData.category.toLowerCase()} industry`;
  }

  return description.trim() || 'I run a business website';
};

export const getThemePreview = async (formData: Record<string, string>): Promise<ThemePreviewResponse> => {
  try {
    const description = constructPlainDescription(formData);
    console.log('Sending description to API:', description);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch('https://webdevs.applytocollege.pk/get_theme_preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('API Response status:', response.status);

      if (response.status === 404) {
        console.log('No products found, using enhanced fallback data');
        return getFallbackData(formData, 
          'We have selected a template based on your industry and goals while our service processes your specific request.'
        );
      }

      if (!response.ok) {
        console.log('API Response not OK:', response.status, response.statusText);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const rawResponse = await response.text();
      console.log('Raw API Response:', rawResponse);

      try {
        const jsonResponse = JSON.parse(rawResponse);
        return {
          ...jsonResponse,
          raw_response: rawResponse,
          plain_description: description
        };
      } catch (parseError) {
        console.log('Error parsing JSON response:', parseError);
        return getFallbackData(formData,
          'We have selected a template that matches your requirements while our system processes your request.'
        );
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.log('Request timed out');
        return getFallbackData(formData,
          'We have selected a template while waiting for our service to respond.'
        );
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('Error getting theme preview:', error);
    return getFallbackData(formData,
      'We have selected a professional template while our service is being optimized.'
    );
  }
};
