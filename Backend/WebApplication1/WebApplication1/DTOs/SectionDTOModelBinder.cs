using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Threading.Tasks;
namespace WebApplication1.DTOs;
public class SectionDTOModelBinder : IModelBinder
{
    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
        var sectionList = new List<SectionDTO>();
        var index = 0;

        while (true)
        {
            var sectionTitle = bindingContext.ValueProvider.GetValue($"sections[{index}].SectionTitle").FirstValue;
            var vimeoLink = bindingContext.ValueProvider.GetValue($"sections[{index}].VimeoLink").FirstValue;

            if (string.IsNullOrEmpty(sectionTitle) && string.IsNullOrEmpty(vimeoLink))
            {
                break;
            }

            sectionList.Add(new SectionDTO
            {
                SectionTitle = sectionTitle,
                VimeoLink = vimeoLink
            });

            index++;
        }

        bindingContext.Result = ModelBindingResult.Success(sectionList);
        return Task.CompletedTask;
    }
}

