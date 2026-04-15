import { useState } from 'react'
import { useResumeStore } from '../store/resumeStore'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Badge } from '../components/ui'
import { generateId } from '../lib/utils'
import { Plus, X } from 'lucide-react'

export function EducationForm() {
  const { resumeData, addEducation, updateEducation, removeEducation } = useResumeStore()

  const handleAddEducation = () => {
    addEducation({
      id: generateId(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Education</h3>
        <Button onClick={handleAddEducation} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>

      {resumeData.education.map((edu) => (
        <Card key={edu.id}>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Institution"
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                placeholder="University name"
              />
              <Input
                label="Degree"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                placeholder="Bachelor's, Master's, etc."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Field of Study"
                value={edu.field}
                onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                placeholder="Computer Science"
              />
              <Input
                label="GPA (optional)"
                value={edu.gpa}
                onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                placeholder="3.8"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="month"
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
              />
              <Input
                label="End Date"
                type="month"
                value={edu.endDate}
                onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => removeEducation(edu.id)} variant="danger" size="sm">
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function SkillsForm() {
  const { resumeData, addSkill, updateSkill, removeSkill } = useResumeStore()
  const [newSkill, setNewSkill] = useState('')

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill({
        id: generateId(),
        name: newSkill.trim(),
        level: 'Intermediate',
      })
      setNewSkill('')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill..."
            onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
          />
          <Button onClick={handleAddSkill} variant="secondary">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {resumeData.skills.map((skill) => (
            <Badge key={skill.id} variant="info" className="px-3 py-1">
              {skill.name}
              <button
                onClick={() => removeSkill(skill.id)}
                className="ml-2 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function ProjectsForm() {
  const { resumeData, addProject, updateProject, removeProject } = useResumeStore()

  const handleAddProject = () => {
    addProject({
      id: generateId(),
      name: '',
      description: '',
      technologies: [],
      link: '',
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Projects</h3>
        <Button onClick={handleAddProject} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {resumeData.projects.map((project) => (
        <Card key={project.id}>
          <CardContent className="pt-4 space-y-4">
            <Input
              label="Project Name"
              value={project.name}
              onChange={(e) => updateProject(project.id, { name: e.target.value })}
              placeholder="Project name"
            />
            <Input
              label="Link (optional)"
              value={project.link || ''}
              onChange={(e) => updateProject(project.id, { link: e.target.value })}
              placeholder="https://github.com/..."
            />
            <Textarea
              label="Description"
              value={project.description}
              onChange={(e) => updateProject(project.id, { description: e.target.value })}
              placeholder="Describe your project..."
              rows={3}
            />
            <div className="flex justify-end">
              <Button onClick={() => removeProject(project.id)} variant="danger" size="sm">
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
