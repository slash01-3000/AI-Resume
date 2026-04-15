export type AIProvider = 'gemini' | 'openrouter' | 'ollama'

export interface AISettings {
  provider: AIProvider
  apiKey: string
  model: string
  baseUrl?: string // For Ollama
}

export interface AIPrompt {
  system: string
  user: string
}

class AIClient {
  private settings: AISettings | null = null

  async loadSettings() {
    try {
      const { Store } = await import('@tauri-apps/plugin-store')
      const store = await Store.load('settings.json')
      this.settings = await store.get<AISettings>('ai_settings') || null
    } catch (error) {
      console.error('Failed to load AI settings:', error)
    }
  }

  async saveSettings(settings: AISettings) {
    try {
      const { Store } = await import('@tauri-apps/plugin-store')
      const store = await Store.load('settings.json')
      await store.set('ai_settings', settings)
      await store.save()
      this.settings = settings
    } catch (error) {
      console.error('Failed to save AI settings:', error)
      throw error
    }
  }

  getSettings(): AISettings | null {
    return this.settings
  }

  async generateContent(prompt: AIPrompt): Promise<string> {
    if (!this.settings) {
      throw new Error('AI settings not configured. Please set up your API key in settings.')
    }

    switch (this.settings.provider) {
      case 'gemini':
        return this.callGemini(prompt)
      case 'openrouter':
        return this.callOpenRouter(prompt)
      case 'ollama':
        return this.callOllama(prompt)
      default:
        throw new Error(`Unknown AI provider: ${this.settings.provider}`)
    }
  }

  private async callGemini(prompt: AIPrompt): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.settings!.model}:generateContent?key=${this.settings!.apiKey}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt.user }]
        }],
        systemInstruction: {
          parts: [{ text: prompt.system }]
        }
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Gemini API error: ${error}`)
    }

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated'
  }

  private async callOpenRouter(prompt: AIPrompt): Promise<string> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.settings!.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://resume-builder.app',
        'X-Title': 'Resume Builder & Analyzer',
      },
      body: JSON.stringify({
        model: this.settings!.model,
        messages: [
          { role: 'system', content: prompt.system },
          { role: 'user', content: prompt.user },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenRouter API error: ${error}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || 'No response generated'
  }

  private async callOllama(prompt: AIPrompt): Promise<string> {
    const baseUrl = this.settings!.baseUrl || 'http://localhost:11434'
    const url = `${baseUrl}/api/generate`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.settings!.model,
        prompt: `${prompt.system}\n\n${prompt.user}`,
        stream: false,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Ollama API error: ${error}`)
    }

    const data = await response.json()
    return data.response || 'No response generated'
  }

  // Resume-specific prompts
  async generateSummary(experience: string, skills: string): Promise<string> {
    const prompt: AIPrompt = {
      system: 'You are a professional resume writer. Create compelling, concise professional summaries that highlight achievements and value.',
      user: `Based on the following experience and skills, write a powerful 3-4 sentence professional summary:\n\nExperience: ${experience}\n\nSkills: ${skills}`,
    }
    return this.generateContent(prompt)
  }

  async improveBulletPoint(bulletPoint: string): Promise<string> {
    const prompt: AIPrompt = {
      system: 'You are a resume expert. Improve bullet points using action verbs, quantifiable achievements, and the STAR method (Situation, Task, Action, Result).',
      user: `Improve this resume bullet point to make it more impactful and measurable:\n\n${bulletPoint}`,
    }
    return this.generateContent(prompt)
  }

  async extractKeywords(jobDescription: string): Promise<string[]> {
    const prompt: AIPrompt = {
      system: 'You are an ATS optimization expert. Extract the most important keywords and skills from job descriptions.',
      user: `Extract the top 15-20 keywords and skills from this job description that should be included in a resume. Return only a comma-separated list:\n\n${jobDescription}`,
    }
    const response = await this.generateContent(prompt)
    return response.split(',').map(k => k.trim()).filter(k => k.length > 0)
  }

  async generateExperiencePoints(role: string, company: string, achievements: string): Promise<string[]> {
    const prompt: AIPrompt = {
      system: 'You are a professional resume writer. Create 3-5 strong bullet points using action verbs and quantifiable results.',
      user: `Generate 4 professional resume bullet points for this role:\n\nRole: ${role}\nCompany: ${company}\nKey achievements/responsibilities: ${achievements}`,
    }
    const response = await this.generateContent(prompt)
    // Parse bullet points from response
    return response.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('•')).map(line => line.replace(/^[-•]\s*/, ''))
  }
}

export const aiClient = new AIClient()
