import { useState } from 'react'

export interface AnalyzerResult {
  overallScore: number
  atsCompatibility: number
  keywordMatch: number
  actionVerbScore: number
  impactScore: number
  formatScore: number
  missingKeywords: string[]
  weakBulletPoints: string[]
  formattingIssues: string[]
  suggestions: string[]
}

export interface AnalysisState {
  isAnalyzing: boolean
  result: AnalyzerResult | null
  error: string | null
  resumeText: string | null
  jobDescription: string | null
}

export const useAnalyzer = () => {
  const [state, setState] = useState<AnalysisState>({
    isAnalyzing: false,
    result: null,
    error: null,
    resumeText: null,
    jobDescription: null,
  })

  const setResumeText = (text: string) => {
    setState((prev) => ({ ...prev, resumeText: text }))
  }

  const setJobDescription = (text: string) => {
    setState((prev) => ({ ...prev, jobDescription: text }))
  }

  const analyzeResume = async (resumeText: string, jobDescription?: string) => {
    setState((prev) => ({ ...prev, isAnalyzing: true, error: null }))

    try {
      // This will call the Rust backend for analysis
      const { invoke } = await import('@tauri-apps/api/core')
      
      const result = await invoke<AnalyzerResult>('analyze_resume', {
        resumeText,
        jobDescription: jobDescription || '',
      })

      setState((prev) => ({
        ...prev,
        isAnalyzing: false,
        result,
        resumeText,
        jobDescription: jobDescription || null,
      }))

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed'
      setState((prev) => ({
        ...prev,
        isAnalyzing: false,
        error: errorMessage,
      }))
      throw error
    }
  }

  const resetAnalysis = () => {
    setState({
      isAnalyzing: false,
      result: null,
      error: null,
      resumeText: null,
      jobDescription: null,
    })
  }

  return {
    ...state,
    setResumeText,
    setJobDescription,
    analyzeResume,
    resetAnalysis,
  }
}
