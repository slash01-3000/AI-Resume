import { useState } from 'react'
import { useResumeStore } from '../store/resumeStore'
import { Button, Input, Textarea, Card, CardHeader, CardTitle, CardContent } from '../components/ui'
import { generateId } from '../lib/utils'
import { Plus, X } from 'lucide-react'

export function PersonalInfoForm() {
  const { resumeData, updatePersonalInfo } = useResumeStore()
  const info = resumeData.personalInfo

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          id="fullName"
          label="Full Name"
          value={info.fullName}
          onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
          placeholder="John Doe"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="email"
            label="Email"
            type="email"
            value={info.email}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            placeholder="john@example.com"
          />
          <Input
            id="phone"
            label="Phone"
            value={info.phone}
            onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <Input
          id="location"
          label="Location"
          value={info.location}
          onChange={(e) => updatePersonalInfo({ location: e.target.value })}
          placeholder="San Francisco, CA"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="linkedin"
            label="LinkedIn"
            value={info.linkedin}
            onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
            placeholder="linkedin.com/in/johndoe"
          />
          <Input
            id="website"
            label="Website"
            value={info.website}
            onChange={(e) => updatePersonalInfo({ website: e.target.value })}
            placeholder="johndoe.com"
          />
        </div>
        <Textarea
          id="summary"
          label="Professional Summary"
          value={info.summary}
          onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
          placeholder="Write a compelling 3-4 sentence summary highlighting your experience and value..."
          rows={4}
        />
      </CardContent>
    </Card>
  )
}

export function ExperienceForm() {
  const { resumeData, addExperience, updateExperience, removeExperience } = useResumeStore()

  const handleAddExperience = () => {
    addExperience({
      id: generateId(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: [],
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Work Experience</h3>
        <Button onClick={handleAddExperience} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {resumeData.experience.map((exp, index) => (
        <ExperienceItem
          key={exp.id}
          experience={exp}
          onUpdate={(updates) => updateExperience(exp.id, updates)}
          onRemove={() => removeExperience(exp.id)}
        />
      ))}
    </div>
  )
}

interface ExperienceItemProps {
  experience: any
  onUpdate: (updates: any) => void
  onRemove: () => void
}

function ExperienceItem({ experience, onUpdate, onRemove }: ExperienceItemProps) {
  const [bulletPoint, setBulletPoint] = useState('')

  const handleAddBulletPoint = () => {
    if (bulletPoint.trim()) {
      onUpdate({ description: [...experience.description, bulletPoint.trim()] })
      setBulletPoint('')
    }
  }

  const handleRemoveBulletPoint = (index: number) => {
    onUpdate({
      description: experience.description.filter((_: any, i: number) => i !== index),
    })
  }

  return (
    <Card>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Company"
            value={experience.company}
            onChange={(e) => onUpdate({ company: e.target.value })}
            placeholder="Company name"
          />
          <Input
            label="Position"
            value={experience.position}
            onChange={(e) => onUpdate({ position: e.target.value })}
            placeholder="Your title"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="month"
            value={experience.startDate}
            onChange={(e) => onUpdate({ startDate: e.target.value })}
          />
          <div className="space-y-2">
            <Input
              label="End Date"
              type="month"
              value={experience.endDate}
              onChange={(e) => onUpdate({ endDate: e.target.value })}
              disabled={experience.current}
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={experience.current}
                onChange={(e) => onUpdate({ current: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm">I currently work here</span>
            </label>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Achievements & Responsibilities</label>
          {experience.description.map((point: string, index: number) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <p className="flex-1 text-sm">{point}</p>
              <button
                onClick={() => handleRemoveBulletPoint(index)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              value={bulletPoint}
              onChange={(e) => setBulletPoint(e.target.value)}
              placeholder="Add a bullet point..."
              onKeyDown={(e) => e.key === 'Enter' && handleAddBulletPoint()}
            />
            <Button onClick={handleAddBulletPoint} variant="secondary" size="sm">
              Add
            </Button>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={onRemove} variant="danger" size="sm">
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
